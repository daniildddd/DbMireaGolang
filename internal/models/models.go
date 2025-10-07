package models

import "time"

// кастомный тип CaffeineLevel(enum)
type CaffeineLevel string

const (
	Low        CaffeineLevel = "low"
	Medium     CaffeineLevel = "medium"
	High       CaffeineLevel = "high"
	ExtraHight CaffeineLevel = "extra_high"
)

type Product struct {
	ProductID       uint              `gorm:"primaryKey;autoIncrement"`
	Name            string            `gorm:"not null"`
	Flavor          string            `gorm:"not null"`
	VolumeML        int               `gorm:"not null;check:volume_ml>0"`
	Price           float64           `gorm:"not nill;check:price>0"`
	Ingredients     string            `gorm:"type:text"`
	CaffeineLevel   CaffeineLevel     `gorm:"type:caffeine_level;default:'medium';not null"`
	ProductionBatch []ProductionBatch `gorm:"foreginKey:ProductID"`
	Inventory       []Inventory       `gorm:"foreginKey:ProductID"`
	Sales           []Sale            `gorm:"foreginKey:ProductID"`
}

type ProductionBatch struct {
	BatchID          uint      `gorm:"primaryKey;autoIncrement"`
	ProductID        uint      `gorm:"not nill"`
	ProductionDate   time.Time `gorm:"not null"`
	QuantityProduced int       `gorm:"not null;check:quantity_produced>0"`
}

type Inventory struct {
	InventoryID     uint `gorm:"primaryKey;autoIncrement"`
	ProductID       uint `gorm:"not null"`
	QuantityInStock int  `gorm:"default:0;check:quantity_in_stock>=0"`
	LastUpdated     time.Time
}

type Sale struct {
	SaleID       uint      `gorm:"primaryKey;autoIncrement"`
	ProductID    uint      `gorm:"not null"`
	SaleDate     time.Time `gorm:"not null"`
	QuantitySold int       `gorm:"not null;check:quantity_sold>0"`
	TotalPrice   float64   `gorm:"not null;check:total_price>=0"`
}

// функция возвращающая название таблицы
func (Product) TableName() string { return "products" }

// функция возвращающая название таблицы
func (ProductionBatch) TableName() string { return "production_batches" }

// функция возвращающая название таблицы
func (Inventory) TableName() string { return "inventory" }

// функция возвращающая название таблицы
func (Sale) TableName() string { return "sale" }
