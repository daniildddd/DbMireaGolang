package database

import (
	"fmt"

	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/models"
	"gorm.io/gorm"
)

// CreateTables пересоздает таблицы в базе данных.
//
// Функция удаляет существующие таблицы и типы в правильном порядке (сначала дочерние, затем родительские) в рамках транзакции, а затем создает новые таблицы на основе моделей.
//
// возвращает ошибку в случае если не смогли создать enum type или таблицы пересоздать
func CreateTables() error {
	logger.Logger.Info("!!! НАЧАЛО ПЕРЕСОЗДАНИЯ ТАБЛИЦ В БАЗЕ ДАННЫХ !!!")

	err := DB.Transaction(func(tx *gorm.DB) error {
		tables := []string{"sales", "inventory", "production_batches", "products"}

		for _, table := range tables {
			if tx.Migrator().HasTable(table) {
				logger.Logger.Info("Попытка удаления таблицы: %s", table)
				if err := tx.Migrator().DropTable(table); err != nil {
					logger.Logger.Error("Ошибка удаления таблицы %s: %v", table, err)
					return fmt.Errorf("не удалось удалить таблицу %s: %w", table, err)
				}
				logger.Logger.Info("Таблица %s успешно удалена", table)
			} else {
				logger.Logger.Info("Таблица %s не существует, пропускаем удаление", table)
			}
		}

		logger.Logger.Info("Удаление старого типа caffeine_level")
		if err := tx.Exec("DROP TYPE IF EXISTS caffeine_level CASCADE").Error; err != nil {
			logger.Logger.Error("Ошибка удаления типа caffeine_level: %v", err)
			return fmt.Errorf("не удалось удалить тип caffeine_level: %w", err)
		}

		logger.Logger.Info("Создание нового типа caffeine_level")
		if err := tx.Exec(`CREATE TYPE caffeine_level AS ENUM ('low', 'medium', 'high', 'extra_high')`).Error; err != nil {
			logger.Logger.Error("Ошибка создания типа caffeine_level: %v", err)
			return fmt.Errorf("не удалось создать тип caffeine_level: %w", err)
		}
		logger.Logger.Info("Тип caffeine_level успешно создан")

		logger.Logger.Info("Начало автоматической миграции таблиц")
		if err := tx.AutoMigrate(&models.Product{}, &models.ProductionBatch{}, &models.Inventory{}, &models.Sale{}); err != nil {
			logger.Logger.Error("!!! ОШИБКА СОЗДАНИЯ ТАБЛИЦ: %v !!!", err)
			return fmt.Errorf("не удалось создать таблицы: %w", err)
		}
		logger.Logger.Info("Таблицы успешно созданы на основе моделей")

		return nil
	})

	if err != nil {
		logger.Logger.Error("!!! ОШИБКА ПРИ ПЕРЕСОЗДАНИИ ТАБЛИЦ: %v !!!", err)
		return err
	}

	logger.Logger.Info("=== ПЕРЕСОЗДАНИЕ ТАБЛИЦ ЗАВЕРШЕНО УСПЕШНО ===")
	return nil
}
