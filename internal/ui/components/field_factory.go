package components

// TODO: надо будет добавть поддержку логгера сюда, то есть везде применять именно логгер, а не вывод в консоль
import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/widget"
	"github.com/daniildddd/DbMireaGolang/internal/utils"
)

// FieldConfig — структура хранящая конфигурацию для полей формы
type FieldConfig struct {
	Label      string
	Type       string
	Required   bool
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
		entry.SetPlaceHolder("Введите " + config.Label)

		lengthValidator := utils.WrapMaxLength(10)
		validators = append(validators, lengthValidator)

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			if err := finalValidator(""); err != nil {
				return nil, fmt.Errorf("инициализация поля %s: %v", config.Label, err)
			}
			entry.Validator = finalValidator
		}
		inputWidget = entry

	case "text_max20":
		entry := widget.NewEntry()
		entry.SetPlaceHolder("Введите " + config.Label + " (макс. 20 символов)")

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
			if err := finalValidator(""); err != nil {
				return nil, fmt.Errorf("инициализация поля %s: %v", config.Label, err)
			}
			entry.Validator = finalValidator
		}
		inputWidget = entry

	case "textarea":
		entry := widget.NewMultiLineEntry()
		entry.SetPlaceHolder("Введите " + config.Label)

		entry.Wrapping = fyne.TextWrapWord
		entry.SetMinRowsVisible(3)

		lengthValidator := utils.WrapMaxLength(30)
		validators = append(validators, lengthValidator)

		entry.OnChanged = func(s string) {
			entry.SetText(utils.TruncateString(s, 30))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			if err := finalValidator(""); err != nil {
				return nil, fmt.Errorf("инициализация поля %s: %v", config.Label, err)
			}
			entry.Validator = finalValidator
		}
		inputWidget = entry

	case "number":
		entry := widget.NewEntry()
		entry.SetPlaceHolder("Введите число")

		// Добавляем валидатор неотрицательного целого
		validators = append(validators, utils.ValidateNonNegativeInt)

		// Фильтрация в реальном времени
		entry.OnChanged = func(s string) {
			filtered := utils.FilterDigits(s)
			entry.SetText(utils.TruncateString(filtered, 10))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			if err := finalValidator(""); err != nil {
				return nil, fmt.Errorf("инициализация поля %s: %v", config.Label, err)
			}
			entry.Validator = finalValidator
		}
		inputWidget = entry

	case "decimal":
		entry := widget.NewEntry()
		entry.SetPlaceHolder("Введите число с точкой")

		// Добавляем валидатор положительного десятичного числа
		validators = append(validators, utils.ValidatePositiveDecimal)

		// Фильтрация в реальном времени
		entry.OnChanged = func(s string) {
			filtered := utils.FilterNumericWithDot(s)
			entry.SetText(utils.TruncateString(filtered, 10))
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			if err := finalValidator(""); err != nil {
				return nil, fmt.Errorf("инициализация поля %s: %v", config.Label, err)
			}
			entry.Validator = finalValidator
		}
		inputWidget = entry

	case "date":
		entry := widget.NewEntry()
		entry.SetPlaceHolder("ГГГГ-ММ-ДД")

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
			if err := finalValidator(""); err != nil {
				return nil, fmt.Errorf("инициализация поля %s: %v", config.Label, err)
			}
			entry.Validator = finalValidator
		}
		inputWidget = entry

	case "datetime":
		entry := widget.NewEntry()
		entry.SetPlaceHolder("ГГГГ-ММ-ДД ЧЧ:ММ")

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
			if err := finalValidator(""); err != nil {
				return nil, fmt.Errorf("инициализация поля %s: %v", config.Label, err)
			}
			entry.Validator = finalValidator
		}
		inputWidget = entry

	case "select":
		selectWidget := widget.NewSelect(config.Options, nil)
		selectWidget.PlaceHolder = "Выберите " + config.Label

		if len(config.Options) > 0 {
			enumValidator := utils.WrapEnum(config.Options)
			validators = append(validators, enumValidator)
		}

		// Комбинируем все валидаторы
		if len(validators) > 0 {
			finalValidator := utils.Combine(config.Label, validators...)
			if err := finalValidator(""); err != nil {
				return nil, fmt.Errorf("инициализация поля %s: %v", config.Label, err)
			}

			selectWidget.OnChanged = func(s string) {
				if err := finalValidator(s); err != nil {
					fmt.Printf("Ошибка валидации: %v\n", err)
				}
			}
		}
		inputWidget = selectWidget

	default:
		return nil, fmt.Errorf("неизвестный тип поля: %s", config.Type)
	}

	return inputWidget, nil
}
