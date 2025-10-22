// Package ui provides UI-related functionality for the application.
package ui

import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/widget"

	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/models"
	"github.com/daniildddd/DbMireaGolang/internal/repository"
	"github.com/daniildddd/DbMireaGolang/internal/ui/metadata"
)

// CreateViewRecordsWindow создает модальное окно (диалог) для просмотра записей из выбранной таблицы.
// Окно содержит кнопку выбора таблицы; после выбора содержимое таблицы обновляется внутри того же модального окна.
func CreateViewRecordsWindow(app fyne.App, parentWindow fyne.Window, table string) fyne.Window {
	// проверим конфигурацию таблицы
	if metadata.GetTableConfig(table) == nil {
		dialog.ShowError(fmt.Errorf("таблица %s не найдена", table), parentWindow)
		// вернём пустое окно на случай, если вызывающий ожидает non-nil
		return app.NewWindow("Просмотр записей")
	}

	// текущее выбранное имя таблицы (ключ)
	currentTable := table

	// данные и колонки, которые будут отображаться в таблице
	data := [][]string{}
	columns := []string{}

	// создание пустой таблицы; её наполнение будет происходить в loadData
	tableWidget := widget.NewTable(
		func() (int, int) { return len(data), len(columns) },
		func() fyne.CanvasObject { return widget.NewLabel("") },
		func(id widget.TableCellID, obj fyne.CanvasObject) {
			lbl := obj.(*widget.Label)
			if id.Row >= 0 && id.Row < len(data) && id.Col >= 0 && id.Col < len(columns) {
				lbl.SetText(data[id.Row][id.Col])
			} else {
				lbl.SetText("")
			}
		},
	)

	// helper: загрузить данные для таблицы и обновить tableWidget
	loadData := func(tableKey string) error {
		data = [][]string{}
		cfg := metadata.GetTableConfig(tableKey)
		if cfg == nil {
			columns = []string{"(нет конфигурации)"}
			tableWidget.Refresh()
			return fmt.Errorf("конфигурация таблицы %s не найдена", tableKey)
		}

		// установим заголовки колонок
		columns = make([]string, len(cfg.FieldsOrder))
		for i, field := range cfg.FieldsOrder {
			columns[i] = cfg.Fields[field].Label
		}

		var err error
		switch tableKey {
		case "products":
			var products []models.Product
			err = repository.GetAllProducts(database.DB, &products)
			for _, p := range products {
				data = append(data, []string{
					fmt.Sprint(p.ProductID),
					p.Name,
					p.Flavor,
					fmt.Sprint(p.VolumeML),
					fmt.Sprint(p.Price),
					string(p.CaffeineLevel),
					p.Ingredients,
				})
			}
		case "production_batches":
			var batches []models.ProductionBatch
			err = repository.GetAllProductionBatches(database.DB, &batches)
			for _, b := range batches {
				data = append(data, []string{
					fmt.Sprint(b.BatchID),
					fmt.Sprint(b.ProductID),
					b.ProductionDate.Format("2006-01-02"),
					fmt.Sprint(b.QuantityProduced),
				})
			}
		case "inventory":
			var inventories []models.Inventory
			err = repository.GetAllInventory(database.DB, &inventories)
			for _, i := range inventories {
				data = append(data, []string{
					fmt.Sprint(i.InventoryID),
					fmt.Sprint(i.ProductID),
					fmt.Sprint(i.QuantityInStock),
					i.LastUpdated.Format("2006-01-02 15:04"),
				})
			}
		case "sales":
			var sales []models.Sale
			err = repository.GetAllSales(database.DB, &sales)
			for _, s := range sales {
				data = append(data, []string{
					fmt.Sprint(s.SaleID),
					fmt.Sprint(s.ProductID),
					s.SaleDate.Format("2006-01-02"),
					fmt.Sprint(s.QuantitySold),
					fmt.Sprint(s.TotalPrice),
				})
			}
		default:
			err = fmt.Errorf("неподдерживаемая таблица: %s", tableKey)
		}

		// обновим виджет и ширины колонок
		tableWidget.Refresh()
		// настройка ширин (грубо)
		if len(columns) > 0 {
			tableWidget.SetColumnWidth(0, 60)
			for i := 1; i < len(columns); i++ {
				tableWidget.SetColumnWidth(i, 120)
			}
		}
		return err
	}

	// статичная метка с названием текущей таблицы и кнопка закрытия
	cfg := metadata.GetTableConfig(currentTable)
	title := ""
	if cfg != nil {
		title = cfg.DisplayName
	} else {
		title = currentTable
	}
	currentLabel := widget.NewLabelWithStyle(title, fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
	closeBtn := widget.NewButton("Закрыть", func() {})

	// header (жирные заголовки колонок) — будет пересоздаваться в loadData
	header := container.NewHBox()

	// селектор таблицы (в этом же окне) — список поддерживаемых ключей
	tableOptions := []string{"products", "production_batches", "inventory", "sales"}
	tableSelect := widget.NewSelect(tableOptions, func(s string) {
		if s == "" || s == currentTable {
			return
		}
		currentTable = s
		cfg := metadata.GetTableConfig(currentTable)
		if cfg != nil {
			currentLabel.SetText(cfg.DisplayName)
		} else {
			currentLabel.SetText(currentTable)
		}
		// загрузить данные для выбранной таблицы
		if err := loadData(currentTable); err != nil {
			dialog.ShowError(fmt.Errorf("ошибка загрузки данных: %v", err), parentWindow)
		}
	})
	tableSelect.SetSelected(currentTable)

	// контейнер с контролами сверху (метка + селектор)
	topControls := container.NewHBox(currentLabel, layout.NewSpacer(), tableSelect)

	// общий контент окна: таблица занимает всё пространство
	// обернём tableWidget в Max, чтобы он расширялся и занимал доступное пространство
	tableArea := container.NewMax(tableWidget)
	// Вложим header сверху, а tableArea в центр, чтобы он мог расширяться
	center := container.NewBorder(header, nil, nil, nil, tableArea)
	content := container.NewBorder(topControls, closeBtn, nil, nil, center)

	// Создадим обычное окно, чтобы таблица могла занять всё пространство и не открывался лишний placeholder
	win := app.NewWindow("Просмотр записей - " + title)
	win.SetContent(content)
	win.Resize(fyne.NewSize(1000, 600))

	// Закрытие: закроем окно
	closeBtn.OnTapped = func() {
		win.Close()
	}

	// загрузка и обновление header внутри loadData — обновим функцию
	oldLoad := loadData
	loadData = func(tableKey string) error {
		err := oldLoad(tableKey)
		// обновим header: пересоздадим метки
		header.Objects = nil
		for _, col := range columns {
			header.Add(widget.NewLabelWithStyle(col, fyne.TextAlignLeading, fyne.TextStyle{Bold: true}))
		}
		header.Refresh()
		// установим разумные ширины колонок
		if len(columns) > 0 {
			tableWidget.SetColumnWidth(0, 80)
			for i := 1; i < len(columns); i++ {
				tableWidget.SetColumnWidth(i, 160)
			}
		}
		tableWidget.Refresh()
		return err
	}

	// загрузим данные для начальной таблицы
	if err := loadData(currentTable); err != nil {
		dialog.ShowError(fmt.Errorf("ошибка загрузки данных: %v", err), parentWindow)
	}

	return win
}
