// Package repositories provides data access logic for database operations.
package repository

import (
	"fmt"

	"gorm.io/gorm"

	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/models"
)

// CreateProductionBatch добавляет новую производственную партию в базу данных.
//
// Параметры:
// - batch: структура ProductionBatch с данными для вставки
//
// Возвращает ошибку, если операция не удалась.
func CreateProductionBatch(batch *models.ProductionBatch) error {
	logger.Info("REPO: Начало добавления производственной партии: %v", batch)
	if err := database.DB.Create(batch).Error; err != nil {
		logger.Error("REPO: Ошибка добавления производственной партии: %v", err)
		return fmt.Errorf("не удалось добавить производственную партию: %v", err)
	}
	logger.Info("REPO: Производственная партия успешно добавлена, ID: %d", batch.BatchID)
	return nil
}

func GetAllProductionBatches(db *gorm.DB, batches *[]models.ProductionBatch) error {
	return db.Find(batches).Error
}
