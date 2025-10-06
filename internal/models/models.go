package models

// кастомный тип CaffeineLevel(enum)
type CaffeineLevel string

const (
	Low        CaffeineLevel = "low"
	Medium     CaffeineLevel = "medium"
	High       CaffeineLevel = "high"
	ExtraHight CaffeineLevel = "extra_high"
)

type Product struct {
}

type ProductionBatch struct{}

type Inventory struct{}

type Sale struct{}

// функция возвращающая название таблицы
func (Product) TableName() string { return "products" }

// функция возвращающая название таблицы
func (ProductionBatch) TableName() string { return "production_batches" }

// функция возвращающая название таблицы
func (Inventory) TableName() string { return "inventory" }

// функция возвращающая название таблицы
func (Sale) TableName() string { return "sale" }
