// тут будут функции для работы со строками(в основном они используются в entry.OnChanged)
package utils

// оставляет только цифры
// пример использования: 123zavod123 -> 123123
// возвращает строчку состоящую только из цифр
func FilterDigits(s string) string { return "" }

// оставляет только цифры и одну точку
// пример использования: 123zav.od123 -> 123.123
// возвращает строчку состоящую только из цифр и одной точки
func FilterNumericWithDot(s string) string { return "" }

// оставляет только цифры и дефисы
// пример использования: 123zav-od123 -> 123-123
// возвращает строчку состоящую только из цифр и дефисов
func FilterDateChars(s string) string { return "" }

// оставляет только цифры, дефисы, пробелы, двоеточия
// пример использования: 2025-palchevskiy<3-12-12 11:11:11 -> 2025-12-12 11:11:11
// возвращает строчку состоящую только из цифр, дефисов, пробелов, двоеточий
func FilterDateTimeChars(s string) string { return "" }

// обрезает строку до maxLen символов
func TruncateString(s string, maxLen int) string { return "" }

// конвертирует snace_case в читаемый формат
// пример использования: product_name -> Product Name
// возвращает строчку в читаемом формате
func ToDisplayName(s string) string { return "" }
