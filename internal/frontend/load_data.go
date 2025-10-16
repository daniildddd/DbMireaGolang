package frontend

import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/widget"
	"gorm.io/gorm"

	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/frontend/components"
)

// ShowLoadDataWindow показывает окно загрузки тестовых данных в базу.
//
// Параметры:
//   - app: экземпляр приложения Fyne
//   - parentWindow: родительское окно для диалога подтверждения
//   - db: подключение к базе данных GORM
//
// Функция отображает диалог подтверждения, а затем в фоновом режиме
// загружает тестовые данные (12 продуктов, 20 партий, 12 записей инвентаря, 25 продаж).
func ShowLoadDataWindow(app fyne.App, parentWindow fyne.Window, db *gorm.DB) {
	win := app.NewWindow("Загрузка тестовых данных")
	win.Resize(fyne.NewSize(400, 200))
	win.CenterOnScreen()

	dialog.ShowConfirm(
		"Загрузка тестовых данных",
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

			// Создаем элементы UI
			statusLabel := components.CreateStyledLabel(
				"Загрузка данных...",
				fyne.TextAlignCenter,
				true,
			)
			progress := widget.NewProgressBarInfinite()
			resultLabel := widget.NewLabel("")
			resultLabel.Wrapping = fyne.TextWrapWord

			closeBtn := widget.NewButton("Закрыть", func() {
				win.Close()
			})
			closeBtn.Hide()

			content := container.NewVBox(
				statusLabel,
				widget.NewSeparator(),
				progress,
				resultLabel,
				closeBtn,
			)

			win.SetContent(container.NewCenter(content))
			win.Show()

			// Выполняем загрузку данных в отдельной горутине
			go func() {
				err := database.SeedData()

				// Обновляем UI после завершения
				progress.Hide()
				closeBtn.Show()

				if err != nil {
					statusLabel.SetText("Ошибка при загрузке данных")
					resultLabel.SetText(fmt.Sprintf("%v", err))
				} else {
					statusLabel.SetText("Данные успешно загружены!")
					resultLabel.SetText(
						"✓ Тестовые данные успешно загружены!\n\n" +
							"Загружено:\n" +
							"• 12 продуктов\n" +
							"• 20 производственных партий\n" +
							"• 12 записей инвентаря\n" +
							"• 25 продаж\n\n" +
							"Теперь вы можете просматривать и работать с данными.",
					)
				}
			}()
		},
		parentWindow,
	)
}
