package database

import (
	"fmt"

	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/models"
	"gorm.io/gorm"
)

// MustCreateTables пересоздает таблицы в базе данных.
//
// Функция удаляет существующие таблицы и типы в правильном порядке (сначала дочерние, затем родительские)
// в рамках транзакции, а затем создает новые таблицы на основе моделей.
// Падает с паникой в случае ошибки удаления или создания таблиц.
func MustCreateTables() {
	logger.Logger.Info("!!! НАЧАЛО ПЕРЕСОЗДАНИЯ ТАБЛИЦ В БАЗЕ ДАННЫХ !!!")

	err := DB.Transaction(func(tx *gorm.DB) error {
		// Определяем порядок удаления таблиц: сначала дочерние, затем родительские
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

		// Проверка и создание пользовательского типа для CaffeineLevel (если используется ENUM)
		if tx.Migrator().HasColumn(&models.Product{}, "caffeine_level") {
			logger.Logger.Info("Проверка и создание типа caffeine_level")
			if err := tx.Exec("DROP TYPE IF EXISTS caffeine_level").Error; err != nil {
				logger.Logger.Error("Ошибка удаления типа caffeine_level: %v", err)
				return fmt.Errorf("не удалось удалить тип caffeine_level: %w", err)
			}
			if err := tx.Exec(`CREATE TYPE caffeine_level AS ENUM ('low', 'medium', 'high', 'extra_high')`).Error; err != nil {
				logger.Logger.Error("Ошибка создания типа caffeine_level: %v", err)
				return fmt.Errorf("не удалось создать тип caffeine_level: %w", err)
			}
			logger.Logger.Info("Тип caffeine_level успешно создан или обновлен")
		}

		// Создание таблиц на основе моделей
		logger.Logger.Info("Начало автоматической миграции таблиц")
		if err := tx.AutoMigrate(&models.Product{}, &models.ProductionBatch{}, &models.Inventory{}, &models.Sale{}); err != nil {
			logger.Logger.Error("!!! ОШИБКА СОЗДАНИЯ ТАБЛИЦ: %v !!!", err)
			return fmt.Errorf("не удалось создать таблицы: %w", err)
		}
		logger.Logger.Info("Таблицы успешно созданы на основе моделей")
		return nil
	})

	if err != nil {
		logger.Logger.Error("!!! ПАНИКА ПРИ ПЕРЕСОЗДАНИИ ТАБЛИЦ: %v !!!", err)
		panic(err)
	}

	logger.Logger.Info("=== ПЕРЕСОЗДАНИЕ ТАБЛИЦ ЗАВЕРШЕНО УСПЕШНО ===")
}
