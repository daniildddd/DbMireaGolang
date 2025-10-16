// Package ui provides database structure viewing functionality.
package frontend

import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"

	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/frontend/components"
)

// TableFieldInfo contains information about a table field
type TableFieldInfo struct {
	Name        string
	Type        string
	Constraints string
}

// ShowDatabaseStructureWindow displays the database structure window.
func ShowDatabaseStructureWindow(app fyne.App, parentWindow fyne.Window) {
	win := app.NewWindow("DB Master")
	win.Resize(fyne.NewSize(1200, 700))
	win.CenterOnScreen()

	logger.Logger.Info("Opened database structure window")

	// Current selected table
	currentTable := "Product"

	// Right panel container
	rightPanelContainer := container.NewVBox()

	// Table buttons (declared before use in updateRightPanel)
	productBtn := widget.NewButton("Product", nil)
	batchBtn := widget.NewButton("ProductionBatch", nil)
	inventoryBtn := widget.NewButton("Inventory", nil)
	saleBtn := widget.NewButton("Sale", nil)

	// Function to update the right panel
	updateRightPanel := func(tableName string, button *widget.Button) {
		// Reset all buttons to default style
		for _, btn := range []*widget.Button{productBtn, batchBtn, inventoryBtn, saleBtn} {
			btn.SetIcon(nil)
			btn.Importance = widget.LowImportance
		}
		// Highlight selected button
		button.SetIcon(theme.ConfirmIcon())
		button.Importance = widget.MediumImportance
		currentTable = tableName
		rightPanelContainer.Objects = nil
		rightPanelContainer.Add(createTableStructurePanel(tableName))
		rightPanelContainer.Refresh()
	}

	// Set button handlers
	productBtn.OnTapped = func() {
		logger.Logger.Info("Selected Product table")
		updateRightPanel("Product", productBtn)
	}
	batchBtn.OnTapped = func() {
		logger.Logger.Info("Selected ProductionBatch table")
		updateRightPanel("ProductionBatch", batchBtn)
	}
	inventoryBtn.OnTapped = func() {
		logger.Logger.Info("Selected Inventory table")
		updateRightPanel("Inventory", inventoryBtn)
	}
	saleBtn.OnTapped = func() {
		logger.Logger.Info("Selected Sale table")
		updateRightPanel("Sale", saleBtn)
	}

	// Style buttons
	for _, btn := range []*widget.Button{productBtn, batchBtn, inventoryBtn, saleBtn} {
		btn.Importance = widget.LowImportance
	}

	// Default selection
	updateRightPanel(currentTable, productBtn)

	// Left panel with table list
	tablesLabel := components.CreateStyledLabel("Таблицы", fyne.TextAlignLeading, true)
	tablesLabel.TextStyle = fyne.TextStyle{Bold: true}

	leftPanel := container.NewVBox(
		tablesLabel,
		widget.NewSeparator(),
		productBtn,
		batchBtn,
		inventoryBtn,
		saleBtn,
	)
	leftPanelBg := canvas.NewRectangle(theme.Color(theme.ColorNameBackground))
	leftPanelWithBg := container.NewStack(leftPanelBg, container.NewPadded(leftPanel))

	// Top bar with connection info
	connInfo := widget.NewLabel("Подключено к: coffee_db@localhost:5432")
	connInfo.TextStyle = fyne.TextStyle{Monospace: true}

	// Removed topRightButtons (gray "Смсгнуть" button)
	// topRightButtons := container.NewHBox(layout.NewSpacer(), syncBtn)

	// Main content area
	contentArea := container.NewBorder(
		nil,
		nil,
		nil,
		nil,
		container.NewScroll(rightPanelContainer),
	)

	// Footer with log info
	logLabel := components.CreateStyledLabel("Лог операций:", fyne.TextAlignLeading, false)
	schemaInfo := widget.NewLabel("Схема БД успешно загружена из schema.json")

	footer := container.NewVBox(logLabel, schemaInfo)

	// Combine all elements
	mainContent := container.NewBorder(
		container.NewVBox(connInfo, widget.NewSeparator()),
		footer,
		nil,
		nil, // Removed topRightButtons
		container.NewHSplit(leftPanelWithBg, contentArea),
	)

	// Tabs
	tabs := container.NewAppTabs(
		container.NewTabItem("Структура БД", mainContent),
		container.NewTabItem("Запросы и фильтрация", widget.NewLabel("Функция в разработке")),
		container.NewTabItem("Соединения (JOIN)", widget.NewLabel("Функция в разработке")),
	)

	win.SetContent(container.NewBorder(
		nil,
		nil,
		nil,
		nil,
		container.NewPadded(tabs),
	))
	win.Show()
}

// createTableStructurePanel creates a panel with table structure
func createTableStructurePanel(tableName string) fyne.CanvasObject {
	// Title with enhanced styling
	titleLabel := components.CreateStyledLabel(
		fmt.Sprintf("Структура таблицы: %s", tableName),
		fyne.TextAlignLeading,
		true,
	)
	titleLabel.TextStyle = fyne.TextStyle{Bold: true}

	// Action buttons (consolidated here)
	applyBtn := widget.NewButton("Применить изменения", func() {
		logger.Logger.Info("Applying changes to table %s", tableName)
	})
	applyBtn.Importance = widget.HighImportance

	cancelBtn := widget.NewButton("Отменить", func() {
		logger.Logger.Info("Cancelling changes for table %s", tableName)
	})
	cancelBtn.Importance = widget.MediumImportance

	buttonsContainer := container.NewHBox(layout.NewSpacer(), applyBtn, cancelBtn)
	buttonsContainer.Resize(fyne.NewSize(300, 40)) // Fixed size to prevent stretching

	// Table fields
	fields := getTableFields(tableName)
	table := createFieldsTable(fields)

	// Increased separation with a larger separator and padding
	separator := widget.NewSeparator()
	separator.Resize(fyne.NewSize(1000, 10)) // Thicker separator for more space

	return container.NewBorder(
		container.NewVBox(titleLabel, separator, buttonsContainer, container.NewPadded(widget.NewSeparator())),
		nil,
		nil,
		nil,
		table,
	)
}

// createFieldsTable creates a table with field information
func createFieldsTable(fields []TableFieldInfo) fyne.CanvasObject {
	// Headers with consistent alignment
	headers := container.NewHBox(
		createTableHeader("Имя поля", 200),
		createTableHeader("Тип", 150),
		createTableHeader("Ограничения", 400),
		createTableHeader("Действия", 250),
	)

	// Rows with alternating background colors
	rows := container.NewVBox()
	for i, field := range fields {
		row := createFieldRow(field, i%2 == 0) // Alternate background
		rows.Add(row)
		if i < len(fields)-1 {
			rows.Add(widget.NewSeparator())
		}
	}

	return container.NewVBox(headers, widget.NewSeparator(), rows)
}

// createTableHeader creates a table column header
func createTableHeader(text string, width float32) fyne.CanvasObject {
	label := components.CreateStyledLabel(text, fyne.TextAlignCenter, true) // Centered alignment
	label.TextStyle = fyne.TextStyle{Bold: true}
	container := container.NewHBox(label)
	container.Resize(fyne.NewSize(width, 30))
	return container
}

// createFieldRow creates a row with field information
func createFieldRow(field TableFieldInfo, alternate bool) fyne.CanvasObject {
	// Column widths
	widths := []float32{200, 150, 400, 250}

	// Field name
	nameLabel := widget.NewLabel(field.Name)
	nameLabel.Alignment = fyne.TextAlignCenter
	nameContainer := container.NewHBox(nameLabel)
	nameContainer.Resize(fyne.NewSize(widths[0], 30))

	// Type
	typeLabel := widget.NewLabel(field.Type)
	typeLabel.Alignment = fyne.TextAlignCenter
	typeContainer := container.NewHBox(typeLabel)
	typeContainer.Resize(fyne.NewSize(widths[1], 30))

	// Constraints
	constraintsLabel := widget.NewLabel(field.Constraints)
	constraintsLabel.Alignment = fyne.TextAlignCenter
	constraintsContainer := container.NewHBox(constraintsLabel)
	constraintsContainer.Resize(fyne.NewSize(widths[2], 30))

	// Actions
	editBtn := widget.NewButton("Редактировать", func() {
		logger.Logger.Info("Editing field: %s", field.Name)
	})
	editBtn.Importance = widget.MediumImportance

	deleteBtn := widget.NewButton("Удалить", func() {
		logger.Logger.Info("Deleting field: %s", field.Name)
	})
	deleteBtn.Importance = widget.DangerImportance

	actionsContainer := container.NewHBox(editBtn, deleteBtn)
	actionsContainer.Resize(fyne.NewSize(widths[3], 30))

	// Row container with alternating background
	row := container.NewHBox(nameContainer, typeContainer, constraintsContainer, actionsContainer)
	if alternate {
		bg := canvas.NewRectangle(theme.Color(theme.ColorNameBackground))
		bg.SetMinSize(fyne.NewSize(1000, 30))
		return container.NewStack(bg, row)
	}
	return row
}

// getTableFields returns field information for a table
func getTableFields(tableName string) []TableFieldInfo {
	switch tableName {
	case "Product":
		return []TableFieldInfo{
			{"ProductID", "uint", "primary key, auto increment"},
			{"Name", "string", "not null"},
			{"Flavor", "string", "not null"},
			{"VolumeML", "int", "not null, check: volume_ml > 0"},
			{"Price", "float64", "not null, check: price > 0"},
			{"Ingredients", "[]string", "not null"},
			{"CaffeineLevel", "enum", "default: medium; not null"},
			{"ProductionBatches", "[]ProductionBatch", "relation"},
			{"Inventory", "[]string", "relation"},
			{"Sales", "[]string", "relation"},
		}
	case "ProductionBatch":
		return []TableFieldInfo{
			{"BatchID", "uint", "primary key, auto increment"},
			{"ProductID", "uint", "not null, foreign key"},
			{"ProductionDate", "time.Time", "not null"},
			{"QuantityProduced", "int", "not null, check: quantity_produced > 0"},
		}
	case "Inventory":
		return []TableFieldInfo{
			{"InventoryID", "uint", "primary key, auto increment"},
			{"ProductID", "uint", "not null, foreign key"},
			{"QuantityInStock", "int", "default: 0, check: quantity_in_stock >= 0"},
			{"LastUpdated", "time.Time", "not null"},
		}
	case "Sale":
		return []TableFieldInfo{
			{"SaleID", "uint", "primary key, auto increment"},
			{"ProductID", "uint", "not null, foreign key"},
			{"SaleDate", "time.Time", "not null"},
			{"QuantitySold", "int", "not null, check: quantity_sold > 0"},
			{"TotalPrice", "float64", "not null, check: total_price >= 0"},
		}
	default:
		return []TableFieldInfo{}
	}
}
