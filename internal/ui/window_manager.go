// Package ui provides UI-related functionality for the application.
package ui

import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/widget"

	"github.com/daniildddd/DbMireaGolang/internal/database"
)

// WindowManager управляет созданием и отображением окон приложения.
type WindowManager struct {
	app        fyne.App
	mainWindow fyne.Window
}

// NewWindowManager создает новый экземпляр WindowManager.
func NewWindowManager(app fyne.App, mainWindow fyne.Window) *WindowManager {
	return &WindowManager{
		app:        app,
		mainWindow: mainWindow,
	}
}

// ShowMainMenu отображает главное меню.
func (wm *WindowManager) ShowMainMenu() {
	if wm.mainWindow == nil {
		wm.app.NewWindow("Error").SetContent(widget.NewLabel("Main window is nil"))
		return
	}
	menu := CreateMainMenu(wm.mainWindow)
	if menu == nil {
		wm.mainWindow.SetContent(widget.NewLabel("Menu creation failed"))
		return
	}
	wm.mainWindow.SetContent(menu)
	wm.mainWindow.Show()
}

// ShowAddRecordWindow открывает окно для добавления записи.
func (wm *WindowManager) ShowAddRecordWindow(table string) {
	if wm.app == nil || wm.mainWindow == nil {
		dialog.ShowError(fmt.Errorf("app or main window is nil"), wm.mainWindow)
		return
	}
	addWindow := CreateAddRecordWindow(wm.app, wm.mainWindow, table)
	if addWindow == nil {
		wm.ShowError(fmt.Errorf("failed to create add record window"))
		return
	}
	addWindow.Show()
}

// ShowViewRecordsWindow открывает окно для просмотра записей.
func (wm *WindowManager) ShowViewRecordsWindow(table string) {
	if wm.app == nil || wm.mainWindow == nil {
		dialog.ShowError(fmt.Errorf("app or main window is nil"), wm.mainWindow)
		return
	}
	// CreateViewRecordsWindow теперь показывает модальный диалог самостоятельно
	CreateViewRecordsWindow(wm.app, wm.mainWindow, table)
}

// ShowError отображает диалоговое окно с ошибкой.
func (wm *WindowManager) ShowError(err error) {
	if wm.mainWindow != nil {
		dialog.ShowError(err, wm.mainWindow)
	}
}

// ShowSuccess отображает диалоговое окно с сообщением об успехе.
func (wm *WindowManager) ShowSuccess(message string) {
	if wm.mainWindow != nil {
		dialog.ShowInformation("Успех", message, wm.mainWindow)
	}
}

// LoadTestData выполняет загрузку тестовых данных в базу.
func (wm *WindowManager) LoadTestData() {
	err := database.SeedData()
	if err != nil {
		wm.ShowError(err)
	} else {
		wm.ShowSuccess("Тестовые данные загружены")
	}
}

// CreateTables выполняет создание таблиц в базе данных.
func (wm *WindowManager) CreateTables() {
	defer func() {
		if r := recover(); r != nil {
			wm.ShowError(fmt.Errorf("panic during table creation: %v", r))
		}
	}()
	database.MustCreateTables()
	wm.ShowSuccess("Таблицы созданы")
}
