// Package ui provides UI-related functionality for the application.
package ui

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/widget"

	"github.com/daniildddd/DbMireaGolang/internal/database"
)

// CreateMainMenu создает главное меню приложения.
func CreateMainMenu(window fyne.Window) fyne.CanvasObject {
	// Кнопки меню
	createTablesBtn := widget.NewButton("Создать таблицы", func() {
		database.MustCreateTables()
		dialog.ShowInformation("Успех", "Таблицы созданы", window)
	})

	loadDataBtn := widget.NewButton("Загрузить тестовые данные", func() {
		err := database.SeedData()
		if err != nil {
			dialog.ShowError(err, window)
		} else {
			dialog.ShowInformation("Успех", "Тестовые данные загружены", window)
		}
	})

	addRecordBtn := widget.NewButton("Добавить запись", func() {
		addWindow := CreateAddRecordWindow(fyne.CurrentApp(), window, "products")
		addWindow.Show()
	})

	viewRecordsBtn := widget.NewButton("Просмотреть записи", func() {
		// Открываем окно просмотра сразу для таблицы products (можно изменить при необходимости)
		viewWin := CreateViewRecordsWindow(fyne.CurrentApp(), window, "products")
		viewWin.Show()
	})

	// Новая кнопка для открытия окна структуры базы данных
	viewDbStructureBtn := widget.NewButton("Просмотреть структуру БД", func() {
		ShowDatabaseStructureWindow(fyne.CurrentApp(), window)
	})

	// Надпись "Панель управления базой данных"
	titleLabel := widget.NewLabel("Панель управления базой данных")
	titleLabel.Alignment = fyne.TextAlignCenter
	titleLabel.TextStyle = fyne.TextStyle{Bold: true} // Делаем заголовок жирным

	// Контейнер для кнопок с заголовком и спейсерами для вертикального центрирования
	buttonContainer := container.NewVBox(
		layout.NewSpacer(), // Пространство сверху
		titleLabel,
		layout.NewSpacer(), // Пространство между заголовком и кнопками
		createTablesBtn,
		loadDataBtn,
		addRecordBtn,
		viewRecordsBtn,
		viewDbStructureBtn, // Добавляем новую кнопку
		layout.NewSpacer(), // Пространство снизу
	)

	// Центрирование по горизонтали
	centeredContainer := container.NewCenter(buttonContainer)

	// Установка минимального размера окна для лучшего отображения
	window.Resize(fyne.NewSize(400, 600)) // Увеличим высоту до 600, чтобы спейсеры работали

	return centeredContainer
}
