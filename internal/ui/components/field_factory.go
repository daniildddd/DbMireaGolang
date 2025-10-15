package components

// TODO: надо будет добавть поддержку логгера сюда, то есть везде применять именно логгер, а не вывод в консоль
import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
	"github.com/daniildddd/DbMireaGolang/internal/utils"
)

// FieldConfig — структура хранящая конфигурацию для полей формы
type FieldConfig struct {
	Label      string
	Type       string
	Required   bool
	MaxLen     int
	Options    []string
	Validation func(string) error
}

// CreateField создает виджет для поля формы на основе конфигурации
//
// Это фабрика, которая возвращает соответствующий CanvasObject(интерфейс базовый для виджетов, по сути это означает чо эта функция может возвращать любой виджет)
// Возвращает ошибку, если валидация начального значения не проходит
func CreateField(field string, config FieldConfig) (fyne.CanvasObject, error) {
	var inputWidget fyne.CanvasObject

	// Создаем базовые валидаторы на основе конфигурации
	validators := make([]func(string, string) error, 0)

	// Добавляем валидатор обязательности, если поле обязательно
	if config.Required {
		validators = append(validators, utils.ValidateRequired)
	}

	// Добавляем специфичные валидаторы для каждого типа
	switch config.Type {
	case "text":
		entry := widget.NewEntry()
		entry.SetPlaceHolder("Введите " + utils.ToDisplayName(field))

		maxLen := config.MaxLen
		if maxLen <= 0 {
			maxLen = 10
		}

		lengthValidator := utils.WrapMaxLength(maxLen)
		validators = append(validators, lengthValidator)
		// добавляем валидацию букв только
		validators = append(validators, utils.ValidateLettersOnly)

		// Фильтрация в реальном времени: сначала оставить только буквы, затем усечь
		entry.OnChanged = func(s string) {
			filtered := utils.FilterLetters(s)
			entry.SetText(utils.TruncateString(filtered, maxLen))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			entry.Validator = finalValidator
		}
		// Добавляем стилизованную метку над полем
		label := widget.NewLabelWithStyle(utils.ToDisplayName(field), fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
		inputWidget = container.NewVBox(label, entry)

	case "text_max20":
		entry := widget.NewEntry()
		entry.SetPlaceHolder("Введите " + utils.ToDisplayName(field) + " (макс. 20 символов)")

		// Добавляем валидатор длины
		lengthValidator := utils.WrapMaxLength(20)
		validators = append(validators, lengthValidator)

		// Фильтрация длины в реальном времени
		entry.OnChanged = func(s string) {
			entry.SetText(utils.TruncateString(s, 20))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			entry.Validator = finalValidator
		}
		label := widget.NewLabelWithStyle(utils.ToDisplayName(field), fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
		inputWidget = container.NewVBox(label, entry)

	case "textarea":
		entry := widget.NewMultiLineEntry()
		entry.SetPlaceHolder("Введите " + utils.ToDisplayName(field))

		entry.Wrapping = fyne.TextWrapWord
		entry.SetMinRowsVisible(3)

		maxLen := config.MaxLen
		if maxLen <= 0 {
			maxLen = 300
		}

		lengthValidator := utils.WrapMaxLength(maxLen)
		validators = append(validators, lengthValidator)
		validators = append(validators, utils.ValidateLettersOnly)

		entry.OnChanged = func(s string) {
			filtered := utils.FilterLetters(s)
			entry.SetText(utils.TruncateString(filtered, maxLen))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			entry.Validator = finalValidator
		}
		label := widget.NewLabelWithStyle(utils.ToDisplayName(field), fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
		inputWidget = container.NewVBox(label, entry)

	case "number":
		entry := widget.NewEntry()
		entry.SetPlaceHolder(utils.ToDisplayName(field))

		// Добавляем валидатор неотрицательного целого
		validators = append(validators, utils.ValidateNonNegativeInt)

		maxLen := config.MaxLen
		if maxLen <= 0 {
			maxLen = 10
		}

		// Фильтрация в реальном времени
		entry.OnChanged = func(s string) {
			filtered := utils.FilterDigits(s)
			entry.SetText(utils.TruncateString(filtered, maxLen))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			entry.Validator = finalValidator
		}
		label := widget.NewLabelWithStyle(utils.ToDisplayName(field), fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
		inputWidget = container.NewVBox(label, entry)

	case "decimal":
		entry := widget.NewEntry()
		entry.SetPlaceHolder(utils.ToDisplayName(field))

		// Добавляем валидатор положительного десятичного числа
		validators = append(validators, utils.ValidatePositiveDecimal)

		maxLen := config.MaxLen
		if maxLen <= 0 {
			maxLen = 10
		}

		// Фильтрация в реальном времени
		entry.OnChanged = func(s string) {
			filtered := utils.FilterNumericWithDot(s)
			entry.SetText(utils.TruncateString(filtered, maxLen))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			entry.Validator = finalValidator
		}
		label := widget.NewLabelWithStyle(utils.ToDisplayName(field), fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
		inputWidget = container.NewVBox(label, entry)

	case "date":
		entry := widget.NewEntry()
		entry.SetPlaceHolder("ГГГГ-MM-DD")

		// Добавляем валидатор даты
		validators = append(validators, utils.ValidateDate)

		// Фильтрация в реальном времени
		entry.OnChanged = func(s string) {
			filtered := utils.FilterDateChars(s)
			entry.SetText(utils.TruncateString(filtered, 10))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			entry.Validator = finalValidator
		}
		label := widget.NewLabelWithStyle(utils.ToDisplayName(field), fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
		inputWidget = container.NewVBox(label, entry)

	case "datetime":
		entry := widget.NewEntry()
		entry.SetPlaceHolder("ГГГГ-MM-DD HH:MM")

		// Добавляем валидатор даты и времени
		validators = append(validators, utils.ValidateDateTime)

		// Фильтрация в реальном времени
		entry.OnChanged = func(s string) {
			filtered := utils.FilterDateTimeChars(s)
			entry.SetText(utils.TruncateString(filtered, 16))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			entry.Validator = finalValidator
		}
		label := widget.NewLabelWithStyle(utils.ToDisplayName(field), fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
		inputWidget = container.NewVBox(label, entry)

	case "select":
		selectWidget := widget.NewSelect(config.Options, nil)
		selectWidget.PlaceHolder = "Выберите " + utils.ToDisplayName(field)

		if len(config.Options) > 0 {
			enumValidator := utils.WrapEnum(config.Options)
			validators = append(validators, enumValidator)
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			selectWidget.OnChanged = func(s string) {
				if err := finalValidator(s); err != nil {
					// Выводим понятное сообщение в лог с человеко-читаемым именем поля
					fmt.Printf("Ошибка валидации поля %s: %v\n", utils.ToDisplayName(field), err)
				}
			}
		}
		label := widget.NewLabelWithStyle(utils.ToDisplayName(field), fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
		inputWidget = container.NewVBox(label, selectWidget)

	default:
		return nil, fmt.Errorf("неизвестный тип поля: %s", config.Type)
	}

	return inputWidget, nil
}
