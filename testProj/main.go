package main

import (
	"fmt"
	"log"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// ---------------------- Модели GORM ----------------------
type CaffeineLevel string

const (
	Low       CaffeineLevel = "low"
	Medium    CaffeineLevel = "medium"
	High      CaffeineLevel = "high"
	ExtraHigh CaffeineLevel = "extra_high"
)

type Product struct {
	ProductID         uint          `gorm:"primaryKey;autoIncrement"`
	Name              string        `gorm:"not null"`
	Flavor            string        `gorm:"not null"`
	VolumeML          int           `gorm:"not null;check:volume_ml>0"`
	Price             float64       `gorm:"not null;check:price>0"`
	Ingredients       string        `gorm:"type:text"`
	CaffeineLevel     CaffeineLevel `gorm:"type:caffeine_level;default:'medium';not null"`
	ProductionBatches []ProductionBatch
	Inventory         []Inventory
	Sales             []Sale
}

type ProductionBatch struct {
	BatchID          uint      `gorm:"primaryKey;autoIncrement"`
	ProductID        uint      `gorm:"not null"`
	ProductionDate   time.Time `gorm:"not null"`
	QuantityProduced int       `gorm:"not null;check:quantity_produced>0"`
}

type Inventory struct {
	InventoryID     uint      `gorm:"primaryKey;autoIncrement"`
	ProductID       uint      `gorm:"not null"`
	QuantityInStock int       `gorm:"default:0;check:quantity_in_stock>=0"`
	LastUpdated     time.Time `gorm:""`
}

type Sale struct {
	SaleID       uint      `gorm:"primaryKey;autoIncrement"`
	ProductID    uint      `gorm:"not null"`
	SaleDate     time.Time `gorm:"not null"`
	QuantitySold int       `gorm:"not null;check:quantity_sold>0"`
	TotalPrice   float64   `gorm:"not null;check:total_price>=0"`
}

// ---------------------- Глобальная переменная DB ----------------------
var gormDB *gorm.DB

// ---------------------- Методы TableName для явных имён ----------------------
func (Product) TableName() string {
	return "products"
}

func (ProductionBatch) TableName() string {
	return "production_batches"
}

func (Inventory) TableName() string {
	return "inventory"
}

func (Sale) TableName() string {
	return "sales"
}

// ---------------------- Подключение к PostgreSQL ----------------------
func connectDB() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Предупреждение: .env файл не найден, используются переменные окружения")
	}
	host := getEnvWithDefault("DB_HOST", "localhost")
	port := getEnvWithDefault("DB_PORT", "5432")
	user := getEnvWithDefault("DB_USER", "postgres")
	password := getEnvWithDefault("DB_PASSWORD", "password")
	dbname := getEnvWithDefault("DB_NAME", "energy_drinks_db")
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)
	gormDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("ошибка подключения GORM: %v", err)
	}
	fmt.Println("Успешное подключение к базе данных")
}

// ---------------------- Создание таблиц (с полной очисткой) ----------------------
func createTables() error {
	// Удаляем существующие таблицы в правильном порядке (сначала дочерние, потом родительские)
	tables := []string{"sales", "inventory", "production_batches", "products"}
	for _, table := range tables {
		if gormDB.Migrator().HasTable(table) {
			if err := gormDB.Migrator().DropTable(table); err != nil {
				return fmt.Errorf("ошибка удаления таблицы %s: %v", table, err)
			}
			fmt.Printf("Таблица %s удалена\n", table)
		}
	}
	// Удаляем тип ENUM если существует
	if err := gormDB.Exec(`DROP TYPE IF EXISTS caffeine_level`).Error; err != nil {
		return fmt.Errorf("ошибка удаления enum: %v", err)
	}
	fmt.Println("Тип caffeine_level удален")
	// Создание ENUM caffeine_level
	err := gormDB.Exec(`DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'caffeine_level') THEN
CREATE TYPE caffeine_level AS ENUM ('low','medium','high','extra_high');
END IF;
END$$;`).Error
	if err != nil {
		return fmt.Errorf("ошибка создания enum: %v", err)
	}
	fmt.Println("Тип caffeine_level создан")
	// Создаем таблицы в правильном порядке (сначала родительские, потом дочерние)
	err = gormDB.AutoMigrate(&Product{}, &ProductionBatch{}, &Inventory{}, &Sale{})
	if err != nil {
		return fmt.Errorf("ошибка создания таблиц: %v", err)
	}
	fmt.Println("Все таблицы успешно созданы заново")
	return nil
}

// ---------------------- Загрузка тестовых данных ----------------------
func loadTestData() error {
	// Проверяем, есть ли уже данные
	var count int64
	gormDB.Table("products").Count(&count)
	if count > 0 {
		return fmt.Errorf("в базе уже есть данные (%d записей в таблице products)", count)
	}
	// 1. Таблица products (12 записей)
	products := []struct {
		id          int
		name        string
		flavor      string
		volume      int
		price       float64
		caffeine    string
		ingredients string
	}{
		{1, "Энергетик Boost", "Лимон-мята", 250, 99.90, "high", "вода, сахар, кофеин, таурин, витамины B, экстракт лимона, экстракт мяты"},
		{2, "Энергетик Boost", "Клубника", 250, 99.90, "high", "вода, сахар, кофеин, таурин, витамины B, экстракт клубники"},
		{3, "Энергетик Boost", "Ананас", 250, 99.90, "high", "вода, сахар, кофеин, таурин, витамины B, экстракт ананаса"},
		{4, "Энергетик MaxCharge", "Чёрная вишня", 500, 149.90, "extra_high", "вода, сахар, кофеин, таурин, гуарана, витамины B, экстракт вишни"},
		{5, "Энергетик MaxCharge", "Голубика", 500, 149.90, "extra_high", "вода, сахар, кофеин, таурин, гуарана, витамины B, экстракт голубики"},
		{6, "Энергетик MaxCharge", "Манго", 500, 149.90, "extra_high", "вода, сахар, кофеин, таурин, гуарана, витамины B, экстракт манго"},
		{7, "Изотоник Hydrate", "Апельсин", 500, 89.50, "low", "вода, электролиты, натрий, калий, магний, витамин C, экстракт апельсина"},
		{8, "Изотоник Hydrate", "Лимон", 500, 89.50, "low", "вода, электролиты, натрий, калий, магний, витамин C, экстракт лимона"},
		{9, "Изотоник Hydrate", "Арбуз", 500, 89.50, "low", "вода, электролиты, натрий, калий, магний, витамин C, экстракт арбуза"},
		{10, "Витаминный напиток VitaZest", "Яблоко-морковь", 330, 119.00, "medium", "вода, витамины A, C, E, минералы, экстракт яблока, морковный сок, небольшое количество кофеина"},
		{11, "Витаминный напиток VitaZest", "Апельсин-имбирь", 330, 119.00, "medium", "вода, витамины A, C, E, минералы, экстракт апельсина, экстракт имбиря, небольшое количество кофеина"},
		{12, "Витаминный напиток VitaZest", "Гранат", 330, 119.00, "medium", "вода, витамины A, C, E, минералы, экстракт граната, небольшое количество кофеина"},
	}
	for _, p := range products {
		if err := gormDB.Exec(`INSERT INTO products (product_id, name, flavor, volume_ml, price, caffeine_level, ingredients)
VALUES (?, ?, ?, ?, ?, ?::caffeine_level, ?)`, p.id, p.name, p.flavor, p.volume, p.price, p.caffeine, p.ingredients).Error; err != nil {
			return fmt.Errorf("ошибка вставки продукта: %v", err)
		}
	}
	// 2. Таблица production_batches (20 записей)
	batches := []struct {
		id       int
		prodID   int
		date     string
		quantity int
	}{
		{1, 1, "2024-02-01", 10000},
		{2, 2, "2024-02-02", 10000},
		{3, 3, "2024-02-03", 10000},
		{4, 4, "2024-02-01", 8000},
		{5, 5, "2024-02-02", 8000},
		{6, 6, "2024-02-03", 8000},
		{7, 7, "2024-02-01", 12000},
		{8, 8, "2024-02-02", 12000},
		{9, 9, "2024-02-03", 12000},
		{10, 10, "2024-02-01", 7000},
		{11, 11, "2024-02-02", 7000},
		{12, 12, "2024-02-03", 7000},
		{13, 1, "2024-02-10", 10000},
		{14, 4, "2024-02-10", 8000},
		{15, 7, "2024-02-10", 12000},
		{16, 10, "2024-02-10", 7000},
		{17, 2, "2024-02-15", 10000},
		{18, 5, "2024-02-15", 8000},
		{19, 8, "2024-02-15", 12000},
		{20, 11, "2024-02-15", 7000},
	}
	for _, b := range batches {
		if err := gormDB.Exec(`INSERT INTO production_batches (batch_id, product_id, production_date, quantity_produced)
VALUES (?, ?, ?, ?)`, b.id, b.prodID, b.date, b.quantity).Error; err != nil {
			return fmt.Errorf("ошибка вставки партии: %v", err)
		}
	}
	// 3. Таблица inventory (12 записей)
	inventory := []struct {
		id       int
		prodID   int
		quantity int
		updated  string
	}{
		{1, 1, 5000, "2024-02-29 16:00:00"},
		{2, 2, 4800, "2024-02-29 16:15:00"},
		{3, 3, 5200, "2024-02-29 16:30:00"},
		{4, 4, 3000, "2024-02-29 16:45:00"},
		{5, 5, 3100, "2024-02-29 17:00:00"},
		{6, 6, 2900, "2024-02-29 17:15:00"},
		{7, 7, 6000, "2024-02-29 17:30:00"},
		{8, 8, 6200, "2024-02-29 17:45:00"},
		{9, 9, 5800, "2024-02-29 18:00:00"},
		{10, 10, 2000, "2024-02-29 18:15:00"},
		{11, 11, 2100, "2024-02-29 18:30:00"},
		{12, 12, 1900, "2024-02-29 18:45:00"},
	}
	for _, inv := range inventory {
		if err := gormDB.Exec(`INSERT INTO inventory (inventory_id, product_id, quantity_in_stock, last_updated)
VALUES (?, ?, ?, ?)`, inv.id, inv.prodID, inv.quantity, inv.updated).Error; err != nil {
			return fmt.Errorf("ошибка вставки инвентаря: %v", err)
		}
	}
	// 4. Таблица sales (25 записей)
	sales := []struct {
		id       int
		prodID   int
		date     string
		quantity int
		total    float64
	}{
		{1, 1, "2024-02-05", 1000, 99900.00},
		{2, 2, "2024-02-05", 950, 94905.00},
		{3, 3, "2024-02-06", 1100, 109890.00},
		{4, 4, "2024-02-07", 800, 119920.00},
		{5, 5, "2024-02-08", 750, 112425.00},
		{6, 6, "2024-02-09", 850, 127415.00},
		{7, 7, "2024-02-10", 1500, 134250.00},
		{8, 8, "2024-02-11", 1400, 125300.00},
		{9, 9, "2024-02-12", 1600, 143200.00},
		{10, 10, "2024-02-13", 500, 59500.00},
		{11, 11, "2024-02-14", 480, 57120.00},
		{12, 12, "2024-02-15", 520, 61880.00},
		{13, 1, "2024-02-16", 900, 89910.00},
		{14, 4, "2024-02-17", 700, 104930.00},
		{15, 7, "2024-02-18", 1300, 116350.00},
		{16, 10, "2024-02-19", 400, 47600.00},
		{17, 2, "2024-02-20", 1000, 99900.00},
		{18, 5, "2024-02-21", 800, 119920.00},
		{19, 8, "2024-02-22", 1200, 107400.00},
		{20, 11, "2024-02-23", 500, 59500.00},
		{21, 3, "2024-02-24", 950, 113805.00},
		{22, 6, "2024-02-25", 750, 112425.00},
		{23, 9, "2024-02-26", 1400, 125300.00},
		{24, 12, "2024-02-27", 480, 57120.00},
		{25, 1, "2024-02-28", 800, 79920.00},
	}
	for _, s := range sales {
		if err := gormDB.Exec(`INSERT INTO sales (sale_id, product_id, sale_date, quantity_sold, total_price)
VALUES (?, ?, ?, ?, ?)`, s.id, s.prodID, s.date, s.quantity, s.total).Error; err != nil {
			return fmt.Errorf("ошибка вставки продажи: %v", err)
		}
	}
	// Обновляем последовательности (sequences)
	gormDB.Exec("SELECT setval('products_product_id_seq', (SELECT MAX(product_id) FROM products))")
	gormDB.Exec("SELECT setval('production_batches_batch_id_seq', (SELECT MAX(batch_id) FROM production_batches))")
	gormDB.Exec("SELECT setval('inventory_inventory_id_seq', (SELECT MAX(inventory_id) FROM inventory))")
	gormDB.Exec("SELECT setval('sales_sale_id_seq', (SELECT MAX(sale_id) FROM sales))")
	return nil
}

func getEnvWithDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// ---------------------- Красивый GUI ----------------------
func getTables() []string {
	return []string{"products", "production_batches", "inventory", "sales"}
}

func getTableDisplayName(table string) string {
	names := map[string]string{
		"products":           "Продукты",
		"production_batches": "Производственные партии",
		"inventory":          "Складские запасы",
		"sales":              "Продажи",
	}
	return names[table]
}

type FieldConfig struct {
	Label      string
	Type       string
	Required   bool
	Options    []string
	Validation func(string) error
}

func getFieldConfigs(table string) map[string]FieldConfig {
	switch table {
	case "products":
		return map[string]FieldConfig{
			"name":           {"Название продукта", "text", true, nil, nil},
			"flavor":         {"Вкус", "text", true, nil, nil},
			"volume_ml":      {"Объем (мл)", "number", true, nil, nil},
			"price":          {"Цена", "decimal", true, nil, nil},
			"ingredients":    {"Ингредиенты", "textarea", false, nil, nil},
			"caffeine_level": {"Уровень кофеина", "select", true, []string{"low", "medium", "high", "extra_high"}, nil},
		}
	case "production_batches":
		return map[string]FieldConfig{
			"product_id":        {"ID продукта", "number", true, nil, nil},
			"production_date":   {"Дата производства", "date", true, nil, nil},
			"quantity_produced": {"Количество произведено", "number", true, nil, nil},
		}
	case "inventory":
		return map[string]FieldConfig{
			"product_id":        {"ID продукта", "number", true, nil, nil},
			"quantity_in_stock": {"Количество на складе", "number_zero", true, nil, nil},
			"last_updated":      {"Дата и время последнего обновления", "datetime", true, nil, nil},
		}
	case "sales":
		return map[string]FieldConfig{
			"product_id":    {"ID продукта", "number", true, nil, nil},
			"sale_date":     {"Дата продажи", "date", true, nil, nil},
			"quantity_sold": {"Количество продано", "number", true, nil, nil},
			"total_price":   {"Общая цена", "decimal", true, nil, nil},
		}
	default:
		return map[string]FieldConfig{}
	}
}

// Получить порядок полей для таблицы
func getFieldOrder(table string) []string {
	switch table {
	case "products":
		return []string{"name", "flavor", "volume_ml", "price", "ingredients", "caffeine_level"}
	case "production_batches":
		return []string{"product_id", "production_date", "quantity_produced"}
	case "inventory":
		return []string{"product_id", "quantity_in_stock", "last_updated"}
	case "sales":
		return []string{"product_id", "sale_date", "quantity_sold", "total_price"}
	default:
		return []string{}
	}
}

func createStyledLabel(text string, alignment fyne.TextAlign, bold bool) *widget.Label {
	label := widget.NewLabel(text)
	label.Alignment = alignment
	if bold {
		label.TextStyle = fyne.TextStyle{Bold: true}
	}
	return label
}

func addRecordWindow(parentApp fyne.App) {
	a := parentApp
	win := a.NewWindow("Добавить новую запись")
	win.Resize(fyne.NewSize(550, 650))
	win.CenterOnScreen()

	tables := getTables()
	tableSelect := widget.NewSelect(tables, nil)
	// Преобразуем имена таблиц в отображаемые названия
	displayNames := make([]string, len(tables))
	for i, table := range tables {
		displayNames[i] = getTableDisplayName(table)
	}
	tableSelect.Options = displayNames
	tableSelect.SetSelected(displayNames[0])

	formContainer := container.NewVBox()
	entries := make(map[string]fyne.CanvasObject)

	updateForm := func(displayName string) {
		formContainer.Objects = nil
		entries = make(map[string]fyne.CanvasObject)
		// Найти реальное имя таблицы
		var table string
		for _, t := range tables {
			if getTableDisplayName(t) == displayName {
				table = t
				break
			}
		}
		title := createStyledLabel("Добавление в таблицу: "+displayName, fyne.TextAlignCenter, true)
		formContainer.Add(title)
		formContainer.Add(widget.NewSeparator())
		fieldConfigs := getFieldConfigs(table)
		fieldOrder := getFieldOrder(table)
		for _, field := range fieldOrder {
			config := fieldConfigs[field]
			labelText := config.Label
			if config.Required {
				labelText += " *"
			}
			fieldLabel := createStyledLabel(labelText, fyne.TextAlignLeading, false)
			var inputWidget fyne.CanvasObject
			switch config.Type {
			case "text":
				entry := widget.NewEntry()
				entry.SetPlaceHolder("Введите " + config.Label)
				inputWidget = entry
				entries[field] = entry
			case "textarea":
				entry := widget.NewMultiLineEntry()
				entry.SetPlaceHolder("Введите " + config.Label)
				entry.Wrapping = fyne.TextWrapWord
				entry.SetMinRowsVisible(3)
				inputWidget = entry
				entries[field] = entry
			case "number":
				entry := widget.NewEntry()
				entry.SetPlaceHolder("Введите число")
				entry.OnChanged = func(s string) {
					filtered := ""
					for _, r := range s {
						if r >= '0' && r <= '9' {
							filtered += string(r)
						}
					}
					if filtered != s {
						entry.SetText(filtered)
					}
				}
				entry.Validator = func(text string) error {
					if text == "" && config.Required {
						return fmt.Errorf("это поле обязательно")
					}
					if text != "" {
						num, err := strconv.Atoi(text)
						if err != nil {
							return fmt.Errorf("введите корректное число")
						}
						if num <= 0 {
							return fmt.Errorf("число должно быть больше 0")
						}
					}
					return nil
				}
				inputWidget = entry
				entries[field] = entry
			case "number_zero":
				entry := widget.NewEntry()
				entry.SetPlaceHolder("Введите число (может быть 0)")
				entry.OnChanged = func(s string) {
					filtered := ""
					for _, r := range s {
						if r >= '0' && r <= '9' {
							filtered += string(r)
						}
					}
					if filtered != s {
						entry.SetText(filtered)
					}
				}
				entry.Validator = func(text string) error {
					if text == "" && config.Required {
						return fmt.Errorf("это поле обязательно")
					}
					if text != "" {
						_, err := strconv.Atoi(text)
						if err != nil {
							return fmt.Errorf("введите корректное число")
						}
					}
					return nil
				}
				inputWidget = entry
				entries[field] = entry
			case "decimal":
				entry := widget.NewEntry()
				entry.SetPlaceHolder("Введите число с точкой")
				entry.OnChanged = func(s string) {
					filtered := ""
					dotCount := 0
					for _, r := range s {
						if r >= '0' && r <= '9' {
							filtered += string(r)
						} else if r == '.' && dotCount == 0 {
							filtered += string(r)
							dotCount++
						}
					}
					if filtered != s {
						entry.SetText(filtered)
					}
				}
				entry.Validator = func(text string) error {
					if text == "" && config.Required {
						return fmt.Errorf("это поле обязательно")
					}
					if text != "" {
						num, err := strconv.ParseFloat(text, 64)
						if err != nil {
							return fmt.Errorf("введите корректное число")
						}
						if num <= 0 {
							return fmt.Errorf("число должно быть больше 0")
						}
					}
					return nil
				}
				inputWidget = entry
				entries[field] = entry
			case "date":
				entry := widget.NewEntry()
				entry.SetPlaceHolder("ГГГГ-ММ-ДД")
				entry.OnChanged = func(s string) {
					filtered := ""
					for _, r := range s {
						if (r >= '0' && r <= '9') || r == '-' {
							filtered += string(r)
						}
					}
					if len(filtered) > 10 {
						filtered = filtered[:10]
					}
					if filtered != s {
						entry.SetText(filtered)
					}
				}
				entry.Validator = func(text string) error {
					if text == "" && config.Required {
						return fmt.Errorf("это поле обязательно")
					}
					if text != "" {
						_, err := time.Parse("2006-01-02", text)
						if err != nil {
							return fmt.Errorf("используйте формат гггг-мм-дд")
						}
					}
					return nil
				}
				inputWidget = entry
				entries[field] = entry
			case "datetime":
				entry := widget.NewEntry()
				entry.SetPlaceHolder("ГГГГ-ММ-ДД ЧЧ:ММ")
				entry.OnChanged = func(s string) {
					filtered := ""
					for _, r := range s {
						if (r >= '0' && r <= '9') || r == '-' || r == ' ' || r == ':' {
							filtered += string(r)
						}
					}
					if len(filtered) > 16 {
						filtered = filtered[:16]
					}
					if filtered != s {
						entry.SetText(filtered)
					}
				}
				entry.Validator = func(text string) error {
					if text == "" && config.Required {
						return fmt.Errorf("это поле обязательно")
					}
					if text != "" {
						_, err := time.Parse("2006-01-02 15:04", text)
						if err != nil {
							return fmt.Errorf("используйте формат гггг-мм-дд чч:мм")
						}
					}
					return nil
				}
				inputWidget = entry
				entries[field] = entry
			case "select":
				selectWidget := widget.NewSelect(config.Options, nil)
				selectWidget.PlaceHolder = "Выберите опцию"
				inputWidget = selectWidget
				entries[field] = selectWidget
			}
			formContainer.Add(fieldLabel)
			formContainer.Add(inputWidget)
		}
		formContainer.Refresh()
	}
	updateForm(displayNames[0])
	tableSelect.OnChanged = updateForm

	scrollContainer := container.NewVScroll(formContainer)
	scrollContainer.SetMinSize(fyne.NewSize(450, 400))
	content := container.NewBorder(
		container.NewVBox(
			createStyledLabel("Выберите таблицу для добавления:", fyne.TextAlignCenter, true),
			tableSelect,
			widget.NewSeparator(),
		),
		nil, nil, nil,
		scrollContainer,
	)

	saveBtn := widget.NewButtonWithIcon("Сохранить", theme.DocumentSaveIcon(), nil)
	cancelBtn := widget.NewButtonWithIcon("Отмена", theme.CancelIcon(), func() { win.Close() })
	buttons := container.NewHBox(
		layout.NewSpacer(),
		cancelBtn,
		saveBtn,
	)
	fullContent := container.NewBorder(
		nil, buttons, nil, nil, content,
	)

	win.SetContent(fullContent)
	saveBtn.OnTapped = func() {
		displayName := tableSelect.Selected
		if displayName == "" {
			dialog.ShowInformation("Ошибка", "Не выбрана таблица", win)
			return
		}
		var table string
		for _, t := range tables {
			if getTableDisplayName(t) == displayName {
				table = t
				break
			}
		}
		cols := []string{}
		vals := []interface{}{}
		placeholders := []string{}
		i := 1
		fieldConfigs := getFieldConfigs(table)
		fieldOrder := getFieldOrder(table)
		hasErrors := false
		errorMessages := []string{}
		for _, field := range fieldOrder {
			widgetObj, exists := entries[field]
			if !exists {
				continue
			}
			var value string
			switch w := widgetObj.(type) {
			case *widget.Entry:
				value = w.Text
				if value == "" && fieldConfigs[field].Required {
					hasErrors = true
					errorMessages = append(errorMessages, fmt.Sprintf("• %s: поле обязательно", fieldConfigs[field].Label))
					continue
				}
				if value != "" && w.Validate() != nil {
					hasErrors = true
					errorMessages = append(errorMessages, fmt.Sprintf("• %s: %v", fieldConfigs[field].Label, w.Validate()))
					continue
				}
			case *widget.Select:
				if w.Selected == "" && fieldConfigs[field].Required {
					hasErrors = true
					errorMessages = append(errorMessages, fmt.Sprintf("• %s: поле обязательно", fieldConfigs[field].Label))
					continue
				}
				value = w.Selected
			}
			if value == "" && !fieldConfigs[field].Required {
				continue
			}
			if field == "product_id" && value != "" {
				productID, err := strconv.Atoi(value)
				if err == nil {
					var count int64
					gormDB.Table("products").Where("product_id = ?", productID).Count(&count)
					if count == 0 {
						hasErrors = true
						errorMessages = append(errorMessages, fmt.Sprintf("• Продукт с ID %d не существует", productID))
						continue
					}
				}
			}
			cols = append(cols, field)
			if fieldConfigs[field].Type == "datetime" && value != "" {
				t, _ := time.Parse("2006-01-02 15:04", value)
				vals = append(vals, t)
			} else {
				vals = append(vals, value)
			}
			placeholders = append(placeholders, fmt.Sprintf("$%d", i))
			i++
		}
		if hasErrors {
			errorMsg := "Обнаружены следующие ошибки:\n\n" + strings.Join(errorMessages, "\n")
			dialog.ShowError(fmt.Errorf("%s", errorMsg), win)
			return
		}
		if len(cols) == 0 {
			dialog.ShowError(fmt.Errorf("нет данных для вставки"), win)
			return
		}
		query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", table, strings.Join(cols, ","), strings.Join(placeholders, ","))
		res := gormDB.Exec(query, vals...)
		if res.Error != nil {
			dialog.ShowError(res.Error, win)
			return
		}
		dialog.ShowInformation("Успех", "✓ Запись успешно добавлена!", win)
		win.Close()
	}

	win.Show()
}

func viewRecordsWindow(parentApp fyne.App) {
	a := parentApp
	win := a.NewWindow("Просмотр записей")
	win.Resize(fyne.NewSize(1000, 600))
	win.CenterOnScreen()

	tables := getTables()
	// Преобразуем имена таблиц в отображаемые названия
	displayNames := make([]string, len(tables))
	for i, table := range tables {
		displayNames[i] = getTableDisplayName(table)
	}
	tableSelect := widget.NewSelect(displayNames, nil)
	tableSelect.SetSelected(displayNames[0])
	// Чекбокс для включения JOIN
	joinCheckbox := widget.NewCheck("Показать данные с объединением по Foreign Key", nil)
	joinCheckbox.SetChecked(false)

	var dataTable *widget.Table
	tableContainer := container.NewStack()

	updateTable := func(displayName string, useJoin bool) {
		// Найти реальное имя таблицы
		var table string
		for _, t := range tables {
			if getTableDisplayName(t) == displayName {
				table = t
				break
			}
		}
		var results []map[string]interface{}
		// Выбираем запрос в зависимости от таблицы и режима JOIN
		if useJoin && table != "products" {
			switch table {
			case "production_batches":
				gormDB.Raw(`
SELECT
pb.batch_id,
pb.product_id,
p.name as product_name,
p.flavor as product_flavor,
pb.production_date,
pb.quantity_produced
FROM production_batches pb
LEFT JOIN products p ON pb.product_id = p.product_id
ORDER BY pb.batch_id
`).Scan(&results)
			case "inventory":
				gormDB.Raw(`
SELECT
i.inventory_id,
i.product_id,
p.name as product_name,
p.flavor as product_flavor,
p.volume_ml as product_volume,
i.quantity_in_stock,
i.last_updated
FROM inventory i
LEFT JOIN products p ON i.product_id = p.product_id
ORDER BY i.inventory_id
`).Scan(&results)
			case "sales":
				gormDB.Raw(`
SELECT
s.sale_id,
s.product_id,
p.name as product_name,
p.flavor as product_flavor,
p.price as product_price,
s.sale_date,
s.quantity_sold,
s.total_price
FROM sales s
LEFT JOIN products p ON s.product_id = p.product_id
ORDER BY s.sale_id
`).Scan(&results)
			}
		} else {
			gormDB.Table(table).Find(&results)
		}
		if len(results) == 0 {
			noDataLabel := widget.NewLabel("Нет данных в таблице")
			noDataLabel.Alignment = fyne.TextAlignCenter
			tableContainer.Objects = []fyne.CanvasObject{container.NewCenter(noDataLabel)}
			tableContainer.Refresh()
			return
		}
		// Получить отсортированные имена колонок
		cols := make([]string, 0, len(results[0]))
		for col := range results[0] {
			cols = append(cols, col)
		}
		sort.Strings(cols)
		dataTable = widget.NewTable(
			func() (int, int) {
				return len(results) + 1, len(cols)
			},
			func() fyne.CanvasObject {
				label := widget.NewLabel("")
				label.Wrapping = fyne.TextTruncate
				return label
			},
			func(i widget.TableCellID, o fyne.CanvasObject) {
				label := o.(*widget.Label)
				if i.Row == 0 {
					// Заголовки с форматированием
					colName := cols[i.Col]
					// Делаем заголовки более читаемыми
					displayName := strings.ReplaceAll(colName, "_", " ")
					displayName = strings.Title(displayName)
					label.SetText(displayName)
					label.TextStyle = fyne.TextStyle{Bold: true}
					label.Alignment = fyne.TextAlignCenter
				} else {
					// Данные
					val := results[i.Row-1][cols[i.Col]]
					if val != nil {
						// Форматирование времени
						if t, ok := val.(time.Time); ok {
							label.SetText(t.Format("2006-01-02 15:04:05"))
						} else {
							label.SetText(fmt.Sprintf("%v", val))
						}
					} else {
						label.SetText("")
					}
					label.TextStyle = fyne.TextStyle{}
					label.Alignment = fyne.TextAlignLeading
				}
			},
		)
		// Устанавливаем ширину колонок
		for i := range cols {
			dataTable.SetColumnWidth(i, 180)
		}
		tableContainer.Objects = []fyne.CanvasObject{dataTable}
		tableContainer.Refresh()
	}
	updateTable(displayNames[0], false)
	tableSelect.OnChanged = func(s string) {
		updateTable(s, joinCheckbox.Checked)
	}
	joinCheckbox.OnChanged = func(checked bool) {
		updateTable(tableSelect.Selected, checked)
		// Показываем подсказку, если выбрана таблица products
		var table string
		for _, t := range tables {
			if getTableDisplayName(t) == tableSelect.Selected {
				table = t
				break
			}
		}
		if checked && table == "products" {
			dialog.ShowInformation("Информация",
				"Таблица 'Продукты' является основной и не имеет Foreign Key.\n\n"+
					"Объединение доступно только для таблиц:\n"+
					"• Производственные партии\n"+
					"• Складские запасы\n"+
					"• Продажи",
				win)
		}
	}
	scrollContainer := container.NewScroll(tableContainer)
	scrollContainer.SetMinSize(fyne.NewSize(700, 400))
	content := container.NewBorder(
		container.NewVBox(
			createStyledLabel("Просмотр данных", fyne.TextAlignCenter, true),
			container.NewHBox(
				widget.NewLabel("Таблица:"),
				tableSelect,
			),
			joinCheckbox,
			widget.NewSeparator(),
		),
		nil, nil, nil,
		scrollContainer,
	)

	closeBtn := widget.NewButton("Закрыть", func() { win.Close() })
	buttons := container.NewHBox(layout.NewSpacer(), closeBtn)
	fullContent := container.NewBorder(content, buttons, nil, nil, nil)

	win.SetContent(fullContent)
	win.Show()
}

func createTablesWindow(parentApp fyne.App, parentWindow fyne.Window) {
	a := parentApp
	win := a.NewWindow("Создание таблиц")
	win.Resize(fyne.NewSize(400, 200))
	win.CenterOnScreen()

	dialog.ShowConfirm("Создание таблиц",
		"ВНИМАНИЕ: Все существующие таблицы и данные будут полностью удалены!\n\n"+
			"Вы уверены, что хотите пересоздать таблицы?\n\n"+
			"Это действие:\n"+
			"• Удалит все существующие данные\n"+
			"• Удалит все таблицы\n"+
			"• Создаст чистые новые таблицы",
		func(confirm bool) {
			if !confirm {
				win.Close()
				return
			}
			statusLabel := createStyledLabel("Создание таблиц...", fyne.TextAlignCenter, true)
			progress := widget.NewProgressBarInfinite()
			resultLabel := widget.NewLabel("")
			closeBtn := widget.NewButton("Закрыть", func() {
				win.Close()
			})
			closeBtn.Hide() // Скрываем до завершения
			content := container.NewVBox(
				statusLabel,
				widget.NewSeparator(),
				progress,
				resultLabel,
				closeBtn,
			)
			win.SetContent(container.NewCenter(content))
			win.Show()
			go func() {
				err := createTables()
				progress.Hide()
				closeBtn.Show()
				if err != nil {
					statusLabel.SetText("ошибка при создании таблиц")
					resultLabel.SetText(fmt.Sprintf("%v", err))
				} else {
					statusLabel.SetText("Таблицы успешно созданы!")
					resultLabel.SetText("✓ Все старые таблицы и данные удалены. Созданы чистые новые таблицы.")
				}
			}()
		}, parentWindow)
}

func loadDataWindow(parentApp fyne.App, parentWindow fyne.Window) {
	a := parentApp
	win := a.NewWindow("Загрузка тестовых данных")
	win.Resize(fyne.NewSize(400, 200))
	win.CenterOnScreen()

	dialog.ShowConfirm("Загрузка тестовых данных",
		"Вы уверены, что хотите загрузить тестовые данные?\n\n"+
			"Будет добавлено:\n"+
			"• 12 продуктов\n"+
			"• 20 производственных партий\n"+
			"• 12 записей инвентаря\n"+
			"• 25 продаж\n\n"+
			"Примечание: Если данные уже есть, операция будет отменена.",
		func(confirm bool) {
			if !confirm {
				win.Close()
				return
			}
			statusLabel := createStyledLabel("Загрузка данных...", fyne.TextAlignCenter, true)
			progress := widget.NewProgressBarInfinite()
			resultLabel := widget.NewLabel("")
			closeBtn := widget.NewButton("Закрыть", func() {
				win.Close()
			})
			closeBtn.Hide() // Скрываем до завершения
			content := container.NewVBox(
				statusLabel,
				widget.NewSeparator(),
				progress,
				resultLabel,
				closeBtn,
			)
			win.SetContent(container.NewCenter(content))
			win.Show()
			go func() {
				err := loadTestData()
				progress.Hide()
				closeBtn.Show()
				if err != nil {
					statusLabel.SetText("ошибка при загрузке данных")
					resultLabel.SetText(fmt.Sprintf("%v", err))
				} else {
					statusLabel.SetText("Данные успешно загружены!")
					resultLabel.SetText("✓ Тестовые данные успешно загружены!\n\nЗагружено:\n• 12 продуктов\n• 20 производственных партий\n• 12 записей инвентаря\n• 25 продаж\n\nТеперь вы можете просматривать и работать с данными.")
				}
			}()
		}, parentWindow)
}

func mainMenu(w fyne.Window, a fyne.App) {
	// Создание стилизованных кнопок с иконками
	addBtn := widget.NewButtonWithIcon("Добавить запись", theme.ContentAddIcon(), func() {
		addRecordWindow(a)
	})
	viewBtn := widget.NewButtonWithIcon("Просмотр записей", theme.VisibilityIcon(), func() {
		viewRecordsWindow(a)
	})
	createTablesBtn := widget.NewButtonWithIcon("Создать таблицы", theme.DocumentCreateIcon(), func() {
		createTablesWindow(a, w)
	})
	loadDataBtn := widget.NewButtonWithIcon("Загрузить тестовые данные", theme.DownloadIcon(), func() {
		loadDataWindow(a, w)
	})

	// Создание вертикального контейнера для кнопок
	buttonColumn := container.NewVBox(
		addBtn,
		viewBtn,
		createTablesBtn,
		loadDataBtn,
	)

	// Главный контейнер с отступами и оформлением
	mainContent := container.NewVBox(
		layout.NewSpacer(),
		container.NewCenter(
			container.NewVBox(
				createStyledLabel("EnergyDrinks Manager", fyne.TextAlignCenter, true),
				widget.NewLabel("Управление базой данных энергетических напитков"),
				widget.NewSeparator(),
				createStyledLabel("Главное меню", fyne.TextAlignCenter, false),
				buttonColumn,
			),
		),
		layout.NewSpacer(),
		container.NewCenter(
			widget.NewLabel("© 2024 EnergyDrinks Manager"),
		),
	)
	w.SetContent(container.NewPadded(mainContent))
}

func main() {
	a := app.New()
	a.SetIcon(theme.StorageIcon())
	w := a.NewWindow("EnergyDrinks Manager - Управление базой данных")
	w.SetMaster()
	w.Resize(fyne.NewSize(1000, 600))
	w.CenterOnScreen()

	// Показ загрузки
	progress := widget.NewProgressBarInfinite()
	loadingLabel := createStyledLabel("Подключение к базе данных...", fyne.TextAlignCenter, true)
	loadingContent := container.NewVBox(loadingLabel, progress)
	w.SetContent(container.NewCenter(loadingContent))

	// Запуск в goroutine чтобы не блокировать GUI
	go func() {
		connectDB()
		// Обновляем текст загрузки
		loadingLabel.SetText("Подключение установлено!")
		time.Sleep(500 * time.Millisecond)
		// Показываем главное меню
		mainMenu(w, a)
	}()
	w.ShowAndRun()
}
