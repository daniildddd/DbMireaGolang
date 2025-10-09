// тут будут функции для работы со строками(в основном они используются в entry.Validator)
package utils

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

// структура для ошибок.
//
// в ней хранится имя поля в котором ошибка произошла и сам текст ошибки
// TODO: вроде эти поля можно сделать неэкспортируемыми
type ValidationError struct {
	Field   string
	Message string
}

// метод структуры ValidationError для реализации интерфейса error(это нам позволит тогда структуру ValidatorError возвращать как результат функций с возвращаемым значением error)
//
// возвращает текст ошибки в формате имяПоля: сообщениеОшибки
func (v ValidationError) Error() string {
	return fmt.Sprintf("%s: %s", v.Field, v.Message)
}

// создает новую ошибку валидации
func NewValidationError(field, message string) error {
	return ValidationError{Field: field, Message: message}
}

// проверяет обязательное поле
//
// возвращает ошибку если оно пусто, иначе nil
func ValidateRequired(value, fieldName string) error {
	if strings.TrimSpace(value) == "" {
		return NewValidationError(fieldName, "поле обязательно для значения")
	}
	return nil
}

// проверяет максимальную длину
//
// возвращает ошибку если больше maxLen, иначе nil
func ValidateMaxLength(value string, maxLen int, fieldName string) error {
	if len(value) > maxLen {
		return NewValidationError(fieldName,
			fmt.Sprintf("максимум %d символов, сейчас %d", maxLen, len(value)))
	}
	return nil
}

// проверяет число >0
//
// возвращает ошибку если невозможно преобразовать к числовому значению или если переданное число <= 0, иначе nil
func ValidatePositiveInt(value, fieldName string) error {
	if value == "" {
		return nil
	}

	num, err := strconv.Atoi(value)
	if err != nil {
		return NewValidationError(fieldName,
			fmt.Sprintf("должно быть числом, err = %v", err))
	}

	if num <= 0 {
		return NewValidationError(fieldName, "число должно быть >0")
	}

	return nil
}

// проверяет число >=0
//
// возвращает ошибку если невозможно преобразовать к числовому значению или если переданное число < 0, иначе nil
func ValidateNonNegativeInt(value, fieldName string) error {
	if value == "" {
		return nil
	}

	num, err := strconv.Atoi(value)
	if err != nil {
		return NewValidationError(fieldName,
			fmt.Sprintf("должно быть числом, err = %v", err))
	}

	if num < 0 {
		return NewValidationError(fieldName, "число должно быть >=0")
	}

	return nil
}

// проверяет положительное десятичное число
//
// возвращает ошибку если не удалось преобразовать к float64 или число <0
func ValidatePositiveDecimal(value, fieldName string) error {
	if value == "" {
		return nil
	}

	num, err := strconv.ParseFloat(value, 64)
	if err != nil {
		return NewValidationError(fieldName,
			fmt.Sprintf("должно быть числом, err = %v", err))
	}

	if num < 0 {
		return NewValidationError(fieldName, "число должно быть >0")
	}

	return nil
}

// проверяет дату в формате YYYY-MM-DD
//
// возвращает ошибку если не соответствует формату или дата не лежит в пределах +- 5 лет от нынешней даты
func ValidateDate(value, fieldName string) error {
	if value == "" {
		return nil
	}

	t, err := time.Parse("2006-01-02", value)
	if err != nil {
		return NewValidationError(fieldName, "используйте формат ГГГГ-ММ-ДД")
	}

	//проверка на разумный диаполоз дат(+- 5 лет от сегодня)
	now := time.Now()
	minDate := now.AddDate(-5, 0, 0)
	maxDate := now.AddDate(5, 0, 0)
	if t.Before(minDate) || t.After(maxDate) {
		return NewValidationError(fieldName,
			"дата должна быть в пределах +- 5 лет от текущей")
	}
	return nil
}

// проверяет дату и время в формате YYYY-MM-DD HH:MM
//
// возвращает ошибку если не подходит по формату или дата не лежит в пределах +- 5 лет от нынешней даты
func ValidateDateTime(value, fieldName string) error {
	if value == "" {
		return nil
	}

	t, err := time.Parse("2006-01-02 15:04", value)
	if err != nil {
		return NewValidationError(fieldName, "используйте формат ГГГГ-ММ-ДД ЧЧ:ММ")
	}

	now := time.Now()
	minDate := now.AddDate(-5, 0, 0)
	maxDate := now.AddDate(5, 0, 0)
	if t.Before(minDate) || t.After(maxDate) {
		return NewValidationError(fieldName,
			"дата должна быть в пределах +- 5 лет от текущей")
	}
	return nil
}

// проверяет, что значение из списка допустимых(проверка enum)
func ValidateEnum(value string, allowedValues []string, fieldName string) error {
	if value == "" {
		return nil
	}
	for _, allowed := range allowedValues {
		if value == allowed {
			return nil
		}
	}
	return NewValidationError(fieldName,
		fmt.Sprintf("должно быть одним из: %v", allowedValues))
}

// WrapEnum создает валидатор с фиксированным списком допустимых значений
func WrapEnum(allowedValues []string) func(string, string) error {
	return func(value, fieldName string) error {
		value = strings.TrimSpace(value)
		for _, allowed := range allowedValues {
			if value == allowed {
				return nil
			}
		}
		return &ValidationError{Field: fieldName, Message: "выберите допустимое значение"}
	}
}

// WrapMaxLength создает валидатор с фиксированной максимальной длиной
func WrapMaxLength(maxLen int) func(string, string) error {
	return func(value, fieldName string) error {
		if len(strings.TrimSpace(value)) > maxLen {
			return &ValidationError{Field: fieldName, Message: fmt.Sprintf("максимум %d символов", maxLen)}
		}
		return nil
	}
}

// объединяет несколько валидаторов в один
func Combine(fieldName string, validators ...func(string, string) error) func(string) error {
	return func(value string) error {
		for _, validator := range validators {
			if err := validator(value, fieldName); err != nil {
				return err
			}
		}
		return nil
	}
}
