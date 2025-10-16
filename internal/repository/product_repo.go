// Package repositories provides data access logic for database operations.
package repository

import (
	"fmt"

	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/models"
	"gorm.io/gorm"
)

// CreateProduct добавляет новый продукт в базу данных.
//
// Параметры:
// - product: структура Product с данными для вставки
//
// Возвращает ошибку, если операция не удалась.
func CreateProduct(product *models.Product) error {
	logger.Logger.Info("REPO: Начало добавления продукта: %v", product)
	if err := database.DB.Create(product).Error; err != nil {
		logger.Logger.Error("REPO: Ошибка добавления продукта: %v", err)
		return fmt.Errorf("не удалось добавить продукт: %v", err)
	}
	logger.Logger.Info("REPO: Продукт успешно добавлен, ID: %d", product.ProductID)
	return nil
}

func GetAllProducts(db *gorm.DB, products *[]models.Product) error {
	return db.Find(products).Error
}
