// Package ui provides functionality to create database tables.
package frontend

import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/widget"

	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/frontend/components"
)

// CreateTablesWindow показывает окно создания таблиц в базе данных.
//
// Параметры:
//   - app: экземпляр приложения Fyne
//   - parentWindow: родительское окно для диалога подтверждения
//
// Функция отображает диалог подтверждения, а затем в фоновом режиме
// создает таблицы (удаляет старые, если они существуют).
func CreateTablesWindow(app fyne.App, parentWindow fyne.Window) {
	win := app.NewWindow("Создание таблиц")
	win.Resize(fyne.NewSize(400, 200))
	win.CenterOnScreen()

	dialog.ShowConfirm(
		"Создание таблиц",
		"ВНИМАНИЕ: Все существующие таблицы и данные будут полностью удалены!\n\n"+
			"Вы уверены, что хотите пересоздать таблицы?\n\n"+
			"Это действие:\n"+
			"• Удалит все существующие данные\n"+
			"• Удалит все таблицы\n"+
			"• Создаст чистые новые таблицы",
		func(confirm bool) {
			if !confirm {
				logger.Logger.Info("Операция создания таблиц отменена пользователем")
				return // Закрытие диалога происходит автоматически
			}

			// Создаем элементы UI
			statusLabel := components.CreateStyledLabel(
				"Создание таблиц...",
				fyne.TextAlignCenter,
				true,
			)
			progress := widget.NewProgressBarInfinite()
			resultLabel := widget.NewLabel("")
			resultLabel.Wrapping = fyne.TextWrapWord

			closeBtn := widget.NewButton("Закрыть", func() {
				win.Close()
			})
			closeBtn.Disable() // Изначально кнопка отключена

			content := container.NewVBox(
				statusLabel,
				widget.NewSeparator(),
				progress,
				resultLabel,
				closeBtn,
			)

			win.SetContent(container.NewCenter(content))
			win.Show()

			// Выполняем создание таблиц в отдельной горутине
			go func() {
				defer func() {
					// Синхронизация с UI
					fyne.CurrentApp().SendNotification(&fyne.Notification{
						Title:   "Обновление UI",
						Content: "Завершение операции создания таблиц",
					})

					if r := recover(); r != nil {
						logger.Logger.Error("Паника при создании таблиц: %v", r)
						// Показать диалог об ошибке и обновить UI в callback (в главном потоке)
						dialog.ShowConfirm("Ошибка при создании таблиц", fmt.Sprintf("Произошла ошибка: %v", r), func(_ bool) {
							progress.Hide()
							closeBtn.Enable()
							closeBtn.Show()
							statusLabel.SetText("Ошибка при создании таблиц")
							resultLabel.SetText(fmt.Sprintf("Ошибка: %v", r))
						}, win)
						return
					}

					// Успешное завершение
					// Показать диалог об успешном завершении и обновить UI в callback (в главном потоке)
					dialog.ShowConfirm("Таблицы успешно созданы", "Все старые таблицы и данные удалены. Созданы чистые новые таблицы.", func(_ bool) {
						progress.Hide()
						closeBtn.Enable()
						closeBtn.Show()
						statusLabel.SetText("Таблицы успешно созданы!")
						resultLabel.SetText(
							"✓ Все старые таблицы и данные удалены.\n\n" +
								"Созданы чистые новые таблицы:\n" +
								"• products\n" +
								"• production_batches\n" +
								"• inventory\n" +
								"• sales\n\n" +
								"Теперь вы можете загрузить тестовые данные.",
						)
					}, win)
				}()

				logger.Logger.Info("Запуск процесса создания таблиц")

				// Вызываем функцию создания таблиц
				database.MustCreateTables()
			}()
		},
		parentWindow,
	)
}
