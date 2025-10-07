// тут будут функции для работы со строками(в основном они используются в entry.OnChanged)
package utils

import (
	"strings"
	"unicode"
)

// оставляет только цифры
// пример использования: 123zavod123 -> 123123
// возвращает строчку состоящую только из цифр
func FilterDigits(s string) string {
	res := strings.Builder{}
	for _, v := range s {
		if unicode.IsDigit(v) {
			res.WriteRune(v)
		}
	}
	return res.String()
}

// оставляет только цифры и одну точку
// пример использования: 123zav.od123 -> 123.123
// возвращает строчку состоящую только из цифр и одной точки
func FilterNumericWithDot(s string) string {
	res := strings.Builder{}
	dotCount := 0
	for _, v := range s {
		if unicode.IsDigit(v) {
			res.WriteRune(v)
		} else if v == '.' && dotCount == 0 {
			res.WriteRune(v)
			dotCount++
		}
	}
	return res.String()
}

// оставляет только цифры и дефисы
// пример использования: 123zav-od123 -> 123-123
// возвращает строчку состоящую только из цифр и дефисов
func FilterDateChars(s string) string {
	res := strings.Builder{}
	for _, v := range s {
		if unicode.IsDigit(v) || v == '-' {
			res.WriteRune(v)
		}
	}
	return res.String()
}

// оставляет только цифры, дефисы, пробелы, двоеточия
// пример использования: 2025-palchevskiy<3-12-12 11:11:11 -> 2025-12-12 11:11:11
// возвращает строчку состоящую только из цифр, дефисов, пробелов, двоеточий
func FilterDateTimeChars(s string) string {
	res := strings.Builder{}
	for _, v := range s {
		if unicode.IsDigit(v) || v == '-' || v == ':' || v == ' ' {
			res.WriteRune(v)
		}
	}
	return res.String()
}

// обрезает строку до maxLen символов
func TruncateString(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen]
}

// внутрення функция для того, чтоб первую букву слова делать заглавной
func capitalize(s string) string {
	if s == "" {
		return s
	}
	runes := []rune(s)
	runes[0] = unicode.ToUpper(runes[0])
	return string(runes)
}

// конвертирует snace_case в читаемый формат
// пример использования: product_name -> Product Name
// возвращает строчку в читаемом формате
func ToDisplayName(s string) string {
	words := strings.Split(s, "_")
	for i, word := range words {
		words[i] = capitalize(word)
	}
	return strings.Join(words, " ")
}
