// Package repositories provides data access logic for database operations.
package repository

import (
	"fmt"

	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/models"
	"gorm.io/gorm"
)

// CreateSale добавляет новую продажу в базу данных.
//
// Параметры:
// - sale: структура Sale с данными для вставки
//
// Возвращает ошибку, если операция не удалась.
func CreateSale(sale *models.Sale) error {
	logger.Info("REPO: Начало добавления продажи: %v", sale)
	if err := database.DB.Create(sale).Error; err != nil {
		logger.Error("REPO: Ошибка добавления продажи: %v", err)
		return fmt.Errorf("не удалось добавить продажу: %v", err)
	}
	logger.Info("REPO: Продажа успешно добавлена, ID: %d", sale.SaleID)
	return nil
}

func GetAllSales(db *gorm.DB, sales *[]models.Sale) error {
	return db.Find(sales).Error
}
