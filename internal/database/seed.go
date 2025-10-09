package database

import (
	"fmt"
	"os"
	"strings"

	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"gorm.io/gorm"
)

// SeedData загружает тестовые данные из SQL-файла в базу данных
//
// Функция читает SQL-скрипт из файла (по умолчанию test_data.sql) и выполняет его в транзакции
// Возвращает ошибку, если файл не найден, пуст, или произошла ошибка выполнения
func SeedData() error {
	logger.Logger.Info("=== SEED: Начало загрузки тестовых данных ===")

	// Путь к SQL-файлу
	sqlFilePath := "./seed.data.sql"
	logger.Logger.Info("SEED: Чтение тестовых данных из файла: %s", sqlFilePath)

	// Читаем файл
	sqlScript, err := os.ReadFile(sqlFilePath)
	if err != nil {
		logger.Logger.Error("SEED: Ошибка чтения файла %s: %v", sqlFilePath, err)
		return fmt.Errorf("не удалось прочитать файл %s: %v", sqlFilePath, err)
	}
	if len(sqlScript) == 0 {
		logger.Logger.Error("SEED: Файл %s пуст", sqlFilePath)
		return fmt.Errorf("файл %s пуст", sqlFilePath)
	}

	// Выполняем транзакцию
	err = DB.Transaction(func(tx *gorm.DB) error {
		logger.Logger.Info("SEED: Начало транзакции для загрузки данных")
		if err := tx.Exec(string(sqlScript)).Error; err != nil {
			logger.Logger.Error("SEED: Ошибка выполнения SQL-скрипта: %v", err)
			return fmt.Errorf("ошибка выполнения SQL-скрипта: %v", err)
		}

		// Обновляем последовательности (sequences) для PostgreSQL
		logger.Logger.Info("SEED: Обновление последовательностей (sequences)")
		sequences := map[string]string{
			"products_product_id_seq":         "products",
			"production_batches_batch_id_seq": "production_batches",
			"inventory_inventory_id_seq":      "inventory",
			"sales_sale_id_seq":               "sales",
		}
		for seq, table := range sequences {
			if err := tx.Exec(fmt.Sprintf("SELECT setval('%s', (SELECT COALESCE(MAX(%s), 0) + 1 FROM %s))",
				seq, strings.TrimSuffix(seq, "_seq"), table)).Error; err != nil {
				logger.Logger.Error("SEED: Ошибка обновления последовательности %s: %v", seq, err)
				return fmt.Errorf("ошибка обновления последовательности %s: %v", seq, err)
			}
		}

		logger.Logger.Info("SEED: Транзакция успешно завершена")
		return nil
	})

	if err != nil {
		return err
	}

	logger.Logger.Info("=== SEED: Загрузка тестовых данных завершена успешно ===")
	return nil
}
