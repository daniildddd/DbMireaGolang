package metadata

// конфигурация таблиц и полей

// в чем идея и почему вообще этот файл появился, мы тут будем настраивать форму, то есть описывать таблицы и ее поля(ограничения и так далее), это облегчит создания форм и их заполнение

// тип для описания типов полей таблицы
type fieldType string

const (
	FieldTypeText     fieldType = "text"
	FieldTypeNumber   fieldType = "number"
	FieldTypeDecimal  fieldType = "decimal"
	FieldTypeDate     fieldType = "date"
	FieldTypeDateTime fieldType = "datetime"
)

type FieldConfig struct {
	Label       string             // подпись над полем ввода
	Type        fieldType          // тип поля
	Required    bool               //обязательное поле или нет
	MaxLen      int                // максимальная длина
	Placeholder string             // подпись в поле ввода
	Options     []string           //для enum типа
	Validator   func(string) error //валидация для этого поля
}

type TableConfig struct {
	TableName   string                 // название таблицы(en)
	DisplayName string                 // выводимое название таблицы(ru)
	Fields      map[string]FieldConfig // конфиг полей
	FieldsOrder []string               // порядок отображения
}

//TODO: добавление централизированной выдачи конфигурации таблиц, то есть надо будет реализовать экспортируемую функцию которая будет возвращать tableConfig и получать имя таблицы, внутри будет по сути мапа (имя->функция для получения конфига)
