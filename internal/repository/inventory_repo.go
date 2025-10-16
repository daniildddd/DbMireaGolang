// Package repositories provides data access logic for database operations.
package repository

import (
	"fmt"

	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/models"
	"gorm.io/gorm"
)

// CreateInventory добавляет новую запись инвентаря в базу данных.
//
// Параметры:
// - inventory: структура Inventory с данными для вставки
//
// Возвращает ошибку, если операция не удалась.
func CreateInventory(inventory *models.Inventory) error {
	logger.Logger.Info("REPO: Начало добавления записи инвентаря: %v", inventory)
	if err := database.DB.Create(inventory).Error; err != nil {
		logger.Logger.Error("REPO: Ошибка добавления записи инвентаря: %v", err)
		return fmt.Errorf("не удалось добавить запись инвентаря: %v", err)
	}
	logger.Logger.Info("REPO: Запись инвентаря успешно добавлена, ID: %d", inventory.InventoryID)
	return nil
}

func GetAllInventory(db *gorm.DB, inventories *[]models.Inventory) error {
	return db.Find(inventories).Error
}
