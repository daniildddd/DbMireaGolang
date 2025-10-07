package components

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/widget"
)

// функция для сощлдания и настройки виджета
//
// принимает текстовое содержимое метки(text), выравнивание текста(aligment) и флаг, указывающий должен ли текст быть жирным, возвращает указатель на созданный и настроенный виджет метки
func CreateStyledLabel(text string, aligment fyne.TextAlign, bold bool) *widget.Label {
	label := widget.NewLabel(text)
	label.Alignment = aligment
	if bold {
		label.TextStyle = fyne.TextStyle{Bold: true}
	}
	return label
}
