package metadata

import (
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/utils"
)

// Тип для описания типов полей таблицы.
type fieldType string

const (
	FieldTypeText     fieldType = "text"
	FieldTypeNumber   fieldType = "number"
	FieldTypeDecimal  fieldType = "decimal"
	FieldTypeDate     fieldType = "date"
	FieldTypeDateTime fieldType = "datetime"
	FieldTypeSelect   fieldType = "select"
	FieldTypeTextArea fieldType = "textarea"
)

// FieldConfig — конфиг поля
type FieldConfig struct {
	Label       string             // Подпись над полем ввода
	Type        fieldType          // Тип поля
	Required    bool               // Обязательное поле или нет
	MaxLen      int                // Максимальная длина
	Placeholder string             // Подпись в поле ввода
	Options     []string           // Для enum типа
	Validator   func(string) error // Валидация для этого поля
}

// TableConfig — конфиг таблички
type TableConfig struct {
	TableName   string                 // Название таблицы (en)
	DisplayName string                 // Выводимое название таблицы (ru)
	Fields      map[string]FieldConfig // Конфиг полей
	FieldsOrder []string               // Порядок отображения
}

// GetTableConfig возвращает конфигурацию таблицы по имени
func GetTableConfig(tableName string) *TableConfig {
	configs := map[string]*TableConfig{
		"products":           getProductConfig(),
		"sales":              getSaleConfig(),
		"inventory":          getInventoryConfig(),
		"production_batches": getProductionBatchesConfig(),
	}
	val, ok := configs[tableName]
	if !ok {
		logger.Logger.Error("!!!!конфигурация для таблицы dbname=%s не найдена!!!!", tableName)
		return nil
	}
	return val
}

// getProductConfig возвращает конфиг для таблицы продуктов
func getProductConfig() *TableConfig {
	return &TableConfig{
		TableName:   "products",
		DisplayName: "Продукты",
		FieldsOrder: []string{"name", "flavor", "volume_ml", "price", "caffeine_level", "ingredients"},
		Fields: map[string]FieldConfig{
			"name": {
				Label:       "Название продукта",
				Type:        FieldTypeText,
				Required:    true,
				MaxLen:      20,
				Placeholder: "Введите название",
				Validator:   utils.Combine("Название продукта", utils.ValidateRequired, utils.WrapMaxLength(20)),
			},
			"flavor": {
				Label:       "Вкус",
				Type:        FieldTypeText,
				Required:    true,
				MaxLen:      20,
				Placeholder: "Введите вкус",
				Validator:   utils.Combine("Вкус", utils.ValidateRequired, utils.WrapMaxLength(20)),
			},
			"volume_ml": {
				Label:       "Объем (мл)",
				Type:        FieldTypeNumber,
				Required:    true,
				MaxLen:      4,
				Placeholder: "Введите объем",
				Validator:   utils.Combine("Объем (мл)", utils.ValidateRequired, utils.ValidatePositiveInt),
			},
			"price": {
				Label:       "Цена",
				Type:        FieldTypeDecimal,
				Required:    true,
				MaxLen:      10,
				Placeholder: "Введите цену",
				Validator:   utils.Combine("Цена", utils.ValidateRequired, utils.ValidatePositiveDecimal),
			},
			"caffeine_level": {
				Label:       "Уровень кофеина",
				Type:        FieldTypeSelect,
				Required:    true,
				Options:     []string{"low", "medium", "high", "extra_high"},
				Placeholder: "Выберите уровень",
				Validator:   utils.Combine("Уровень кофеина", utils.ValidateRequired, utils.WrapEnum([]string{"low", "medium", "high", "extra_high"})),
			},
			"ingredients": {
				Label:       "Ингредиенты",
				Type:        FieldTypeTextArea,
				Required:    true,
				Placeholder: "Введите ингредиенты",
				Validator:   utils.Combine("Ингредиенты", utils.ValidateRequired),
			},
		},
	}
}

// getSaleConfig возвращает конфиг для таблицы продаж
func getSaleConfig() *TableConfig {
	return &TableConfig{
		TableName:   "sales",
		DisplayName: "Продажи",
		FieldsOrder: []string{"product_id", "sale_date", "quantity_sold", "total_price"},
		Fields: map[string]FieldConfig{
			"product_id": {
				Label:       "ID продукта",
				Type:        FieldTypeNumber,
				Required:    true,
				MaxLen:      10,
				Placeholder: "Введите ID продукта",
				Validator:   utils.Combine("ID продукта", utils.ValidateRequired, utils.ValidatePositiveInt),
			},
			"sale_date": {
				Label:       "Дата продажи",
				Type:        FieldTypeDate,
				Required:    true,
				Placeholder: "ГГГГ-ММ-ДД",
				Validator:   utils.Combine("Дата продажи", utils.ValidateDate),
			},
			"quantity_sold": {
				Label:       "Количество продано",
				Type:        FieldTypeNumber,
				Required:    true,
				MaxLen:      10,
				Placeholder: "Введите количество",
				Validator:   utils.Combine("Количество продано", utils.ValidateRequired, utils.ValidatePositiveInt),
			},
			"total_price": {
				Label:       "Общая цена",
				Type:        FieldTypeDecimal,
				Required:    true,
				MaxLen:      10,
				Placeholder: "Введите сумму",
				Validator:   utils.Combine("Общая цена", utils.ValidateRequired, utils.ValidatePositiveDecimal),
			},
		},
	}
}

// getInventoryConfig возвращает конфиг для таблицы инвентаря
func getInventoryConfig() *TableConfig {
	return &TableConfig{
		TableName:   "inventory",
		DisplayName: "Инвентарь",
		FieldsOrder: []string{"product_id", "quantity_in_stock", "last_updated"},
		Fields: map[string]FieldConfig{
			"product_id": {
				Label:       "ID продукта",
				Type:        FieldTypeNumber,
				Required:    true,
				MaxLen:      10,
				Placeholder: "Введите ID продукта",
				Validator:   utils.Combine("ID продукта", utils.ValidateRequired, utils.ValidatePositiveInt),
			},
			"quantity_in_stock": {
				Label:       "Количество на складе",
				Type:        FieldTypeNumber,
				Required:    true,
				MaxLen:      10,
				Placeholder: "Введите количество",
				Validator:   utils.Combine("Количество на складе", utils.ValidateRequired, utils.ValidateNonNegativeInt),
			},
			"last_updated": {
				Label:       "Последнее обновление",
				Type:        FieldTypeDateTime,
				Required:    true,
				Placeholder: "ГГГГ-ММ-ДД ЧЧ:ММ",
				Validator:   utils.Combine("Последнее обновление", utils.ValidateDateTime),
			},
		},
	}
}

// getProductionBatchesConfig возвращает конфиг для таблицы производственных партий
func getProductionBatchesConfig() *TableConfig {
	return &TableConfig{
		TableName:   "production_batches",
		DisplayName: "Производственные партии",
		FieldsOrder: []string{"product_id", "production_date", "quantity_produced"},
		Fields: map[string]FieldConfig{
			"product_id": {
				Label:       "ID продукта",
				Type:        FieldTypeNumber,
				Required:    true,
				MaxLen:      10,
				Placeholder: "Введите ID продукта",
				Validator:   utils.Combine("ID продукта", utils.ValidateRequired, utils.ValidatePositiveInt),
			},
			"production_date": {
				Label:       "Дата производства",
				Type:        FieldTypeDate,
				Required:    true,
				Placeholder: "ГГГГ-ММ-ДД",
				Validator:   utils.Combine("Дата производства", utils.ValidateDate),
			},
			"quantity_produced": {
				Label:       "Произведено",
				Type:        FieldTypeNumber,
				Required:    true,
				MaxLen:      10,
				Placeholder: "Введите количество",
				Validator:   utils.Combine("Произведено", utils.ValidateRequired, utils.ValidatePositiveInt),
			},
		},
	}
}
