// Package ui provides functionality to add new records to the database.
package frontend

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/widget"

	"github.com/daniildddd/DbMireaGolang/internal/models"
	"github.com/daniildddd/DbMireaGolang/internal/repository"
	"github.com/daniildddd/DbMireaGolang/internal/frontend/components"
	"github.com/daniildddd/DbMireaGolang/internal/frontend/metadata"

)

// CreateAddRecordWindow создает окно для добавления новой записи в указанную таблицу.
func CreateAddRecordWindow(app fyne.App, parentWindow fyne.Window, table string) fyne.Window {
	win := app.NewWindow("Добавить запись в " + table)
	config := metadata.GetTableConfig(table)
	if config == nil {
		dialog.ShowError(fmt.Errorf("таблица %s не найдена", table), parentWindow)
		return win
	}

	// Создаем контейнер формы и селектор таблиц
	formContainer := container.NewVBox()

	// Список таблиц (соответствует GetTableConfig)
	tables := []string{"products", "production_batches", "inventory", "sales"}
	displayToKey := make(map[string]string)
	displayNames := make([]string, 0, len(tables))
	for _, t := range tables {
		cfg := metadata.GetTableConfig(t)
		if cfg == nil {
			continue
		}
		dn := cfg.DisplayName
		displayToKey[dn] = t
		displayNames = append(displayNames, dn)
	}

	// Текущая выбранная таблица (ключ)
	currentTable := table

	// create select for table choice
	tableSelect := widget.NewSelect(displayNames, nil)
	// set initial selected
	if cfg := metadata.GetTableConfig(table); cfg != nil {
		tableSelect.SetSelected(cfg.DisplayName)
	}

	// entries map will be recreated per-table
	entries := make(map[string]string)

	// save button (uses dynamic currentTable and entries)
	saveBtn := widget.NewButton("Сохранить", func() {
		cfg := metadata.GetTableConfig(currentTable)
		if cfg == nil {
			dialog.ShowError(fmt.Errorf("конфигурация таблицы не найдена"), win)
			return
		}
		// Валидация значений через metadata validators
		var validationErrors []string
		for _, field := range cfg.FieldsOrder {
			val := entries[field]
			fcfg := cfg.Fields[field]
			// обязательность
			if fcfg.Required && strings.TrimSpace(val) == "" {
				validationErrors = append(validationErrors, fmt.Sprintf("%s: обязательное поле", fcfg.Label))
				continue
			}
			if fcfg.Validator != nil {
				if err := fcfg.Validator(val); err != nil {
					validationErrors = append(validationErrors, err.Error())
				}
			}
		}
		if len(validationErrors) > 0 {
			dialog.ShowError(fmt.Errorf("ошибки валидации:\n%s", strings.Join(validationErrors, "\n")), win)
			return
		}
		// Сбор данных
		data := make(map[string]interface{})
		for field, value := range entries {
			data[field] = value
		}

		var err error
		switch currentTable {
		case "products":
			if _, ok := data["name"]; !ok || data["name"] == "" {
				err = fmt.Errorf("поле name обязательно")
				break
			}
			product := &models.Product{
				Name:          data["name"].(string),
				Flavor:        data["flavor"].(string),
				VolumeML:      atoi(data["volume_ml"].(string)),
				Price:         atof(data["price"].(string)),
				CaffeineLevel: models.CaffeineLevel(data["caffeine_level"].(string)),
				Ingredients:   data["ingredients"].(string),
			}
			err = repository.CreateProduct(product)
		case "production_batches":
			if _, ok := data["product_id"]; !ok || data["product_id"] == "" {
				err = fmt.Errorf("поле product_id обязательно")
				break
			}
			batch := &models.ProductionBatch{
				ProductID:        atoui(data["product_id"].(string)),
				ProductionDate:   parseDate(data["production_date"].(string)),
				QuantityProduced: atoi(data["quantity_produced"].(string)),
			}
			err = repository.CreateProductionBatch(batch)
		case "inventory":
			if _, ok := data["product_id"]; !ok || data["product_id"] == "" {
				err = fmt.Errorf("поле product_id обязательно")
				break
			}
			inventory := &models.Inventory{
				ProductID:       atoui(data["product_id"].(string)),
				QuantityInStock: atoi(data["quantity_in_stock"].(string)),
				LastUpdated:     parseDateTime(data["last_updated"].(string)),
			}
			err = repository.CreateInventory(inventory)
		case "sales":
			if _, ok := data["product_id"]; !ok || data["product_id"] == "" {
				err = fmt.Errorf("поле product_id обязательно")
				break
			}
			sale := &models.Sale{
				ProductID:    atoui(data["product_id"].(string)),
				SaleDate:     parseDate(data["sale_date"].(string)),
				QuantitySold: atoi(data["quantity_sold"].(string)),
				TotalPrice:   atof(data["total_price"].(string)),
			}
			err = repository.CreateSale(sale)
		default:
			err = fmt.Errorf("неподдерживаемая таблица: %s", currentTable)
		}

		if err != nil {
			if isForeignKeyError(err) {
				// Дружелюбное сообщение для FK ошибок
				dialog.ShowError(fmt.Errorf("невозможно добавить запись: связанный ресурс не найден. Проверьте значения полей, которые ссылаются на другие таблицы (например, product_id)"), win)
			} else {
				dialog.ShowError(err, win)
			}
		} else {
			// Покажем кастомное модальное окно с единственной кнопкой OK и закроем окно добавления после подтверждения
			var dlg dialog.Dialog
			// Отдельная кнопка чтобы передать её в NewCustomWithButtons
			okBtn := widget.NewButton("OK", func() {
				if dlg != nil {
					dlg.Hide()
				}
				win.Close()
			})
			content := container.NewVBox(
				widget.NewLabel("Запись успешно добавлена"),
				okBtn,
			)
			dlg = dialog.NewCustomWithoutButtons("Успех", content, win)
			dlg.Show()
		}
	})

	// helper to (re)build form for a table
	buildForm := func(tableKey string) {
		formContainer.Objects = nil
		entries = make(map[string]string)
		cfg := metadata.GetTableConfig(tableKey)
		if cfg == nil {
			formContainer.Add(widget.NewLabel("Конфигурация таблицы не найдена"))
			return
		}
		for _, field := range cfg.FieldsOrder {
			fcfg := cfg.Fields[field]
			compFieldConfig := components.FieldConfig{
				Label:      fcfg.Label,
				Type:       string(fcfg.Type),
				Required:   fcfg.Required,
				MaxLen:     fcfg.MaxLen,
				Options:    fcfg.Options,
				Validation: fcfg.Validator,
			}
			fieldWidget, err := components.CreateField(field, compFieldConfig)
			if err != nil {
				formContainer.Add(widget.NewLabel(fmt.Sprintf("ошибка создания поля %s: %v", field, err)))
				continue
			}
			// attach handlers similar to before
			switch w := fieldWidget.(type) {
			case *widget.Entry:
				entries[field] = w.Text
				fieldName := field
				// wrap existing handler to preserve factory filtering
				old := w.OnChanged
				w.OnChanged = func(s string) {
					if old != nil {
						old(s)
					}
					entries[fieldName] = s
				}
			case *widget.Select:
				entries[field] = w.Selected
				fieldName := field
				oldS := w.OnChanged
				w.OnChanged = func(s string) {
					if oldS != nil {
						oldS(s)
					}
					entries[fieldName] = s
				}
			case *fyne.Container:
				cont := w
				if len(cont.Objects) >= 2 {
					switch inner := cont.Objects[1].(type) {
					case *widget.Entry:
						entries[field] = inner.Text
						fieldName := field
						oldInner := inner.OnChanged
						inner.OnChanged = func(s string) {
							if oldInner != nil {
								oldInner(s)
							}
							entries[fieldName] = s
						}
					case *widget.Select:
						entries[field] = inner.Selected
						fieldName := field
						oldInnerS := inner.OnChanged
						inner.OnChanged = func(s string) {
							if oldInnerS != nil {
								oldInnerS(s)
							}
							entries[fieldName] = s
						}
					default:
						// skip
					}
				}
			default:
				// skip unknown
			}
			formContainer.Add(fieldWidget)
		}
		formContainer.Add(saveBtn)
		formContainer.Refresh()
	}

	// Selection change handler
	tableSelect.OnChanged = func(selected string) {
		if k, ok := displayToKey[selected]; ok {
			currentTable = k
			buildForm(currentTable)
		}
	}

	// initial build
	buildForm(currentTable)

	// main content: selector stays on top, form scrolls and fills remainder
	content := container.NewBorder(tableSelect, nil, nil, nil, container.NewVScroll(formContainer))
	win.SetContent(content)
	win.Resize(fyne.NewSize(800, 500))
	return win
}

// Вспомогательные функции для парсинга
func atoi(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return i
}

func atof(s string) float64 {
	f, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0.0
	}
	return f
}

func atoui(s string) uint {
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	if i < 0 {
		return 0
	}
	return uint(i)
}

func parseDate(s string) time.Time {
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		return time.Time{}
	}
	return t
}

func parseDateTime(s string) time.Time {
	t, err := time.Parse("2006-01-02 15:04", s)
	if err != nil {
		return time.Time{}
	}
	return t
}

// isForeignKeyError пытается определить, что ошибка пришла от СУБД и связана с нарушением FK
func isForeignKeyError(err error) bool {
	if err == nil {
		return false
	}
	// простая эвристика: в тексте ошибки Postgres есть 'violates foreign key constraint'
	return strings.Contains(err.Error(), "violates foreign key constraint")
}
