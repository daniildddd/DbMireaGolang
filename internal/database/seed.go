package database

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"

	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"gorm.io/gorm"
)

// SeedData загружает тестовые данные из SQL-файла в базу данных
//
// Функция читает SQL-скрипт из файла (по умолчанию test_data.sql) и выполняет его в транзакции
// Возвращает ошибку, если файл не найден, пуст, или произошла ошибка выполнения
func SeedData() error {
	logger.Info("=== SEED: Начало загрузки тестовых данных ===")

	// Путь к SQL-файлу (имя файла). Мы попытаемся найти его в нескольких местах
	sqlFilePath := "seed.data.sql"
	logger.Info("SEED: Поиск и чтение тестовых данных из файла: %s", sqlFilePath)

	// Попробуем найти файл в нескольких возможных локациях
	findSQLFile := func(name string) (string, error) {
		// Кандидаты для проверки
		candidates := []string{name}

		// директория исполняемого файла
		if exe, err := os.Executable(); err == nil {
			candidates = append(candidates, filepath.Join(filepath.Dir(exe), name))
		}

		// возможная папка исходников пакета - используем runtime.Caller
		if _, file, _, ok := runtime.Caller(0); ok {
			pkgDir := filepath.Dir(file)
			candidates = append(candidates, filepath.Join(pkgDir, name))
			// также попробуем один уровень выше (если запускают из модуля)
			candidates = append(candidates, filepath.Join(pkgDir, "..", name))
		}

		// относительный путь internal/database
		candidates = append(candidates, filepath.Join("internal", "database", name))

		for _, p := range candidates {
			if p == "" {
				continue
			}
			if _, err := os.Stat(p); err == nil {
				return p, nil
			}
		}
		return "", fmt.Errorf("файл %s не найден в проверяемых путях", name)
	}

	filePath, err := findSQLFile(sqlFilePath)
	if err != nil {
		logger.Error("SEED: %v", err)
		return err
	}
	logger.Info("SEED: Файл найден: %s", filePath)

	// Читаем файл
	sqlScript, err := os.ReadFile(filePath)
	if err != nil {
		logger.Error("SEED: Ошибка чтения файла %s: %v", filePath, err)
		return fmt.Errorf("не удалось прочитать файл %s: %v", filePath, err)
	}
	if len(sqlScript) == 0 {
		logger.Error("SEED: Файл %s пуст", sqlFilePath)
		return fmt.Errorf("файл %s пуст", sqlFilePath)
	}

	// Выполняем транзакцию
	err = DB.Transaction(func(tx *gorm.DB) error {
		logger.Info("SEED: Начало транзакции для загрузки данных")
		if err := tx.Exec(string(sqlScript)).Error; err != nil {
			logger.Error("SEED: Ошибка выполнения SQL-скрипта: %v", err)
			return fmt.Errorf("ошибка выполнения SQL-скрипта: %v", err)
		}

		// Обновляем последовательности (sequences) для PostgreSQL
		logger.Info("SEED: Обновление последовательностей (sequences)")
		type seqInfo struct {
			table  string
			column string
		}
		sequences := map[string]seqInfo{
			"products_product_id_seq":         {table: "products", column: "product_id"},
			"production_batches_batch_id_seq": {table: "production_batches", column: "batch_id"},
			"inventory_inventory_id_seq":      {table: "inventory", column: "inventory_id"},
			"sales_sale_id_seq":               {table: "sales", column: "sale_id"},
		}
		for seq, info := range sequences {
			// пропускаем, если таблицы нет
			if !tx.Migrator().HasTable(info.table) {
				logger.Info("SEED: Пропускаем обновление последовательности %s — таблица %s не существует", seq, info.table)
				continue
			}
			// Получаем имя sequence, привязанной к serial/auto-increment колонке, если оно есть
			var seqName string
			if err := tx.Raw("SELECT pg_get_serial_sequence(?, ?)", info.table, info.column).Scan(&seqName).Error; err != nil {
				logger.Error("SEED: Ошибка получения имени sequence для %s.%s: %v", info.table, info.column, err)
				return fmt.Errorf("не удалось определить sequence для %s.%s: %v", info.table, info.column, err)
			}
			if seqName == "" {
				logger.Info("SEED: Sequence для %s.%s не найден — пропускаем", info.table, info.column)
				continue
			}
			q := fmt.Sprintf("SELECT setval('%s', (SELECT COALESCE(MAX(%s), 0) + 1 FROM %s))", seqName, info.column, info.table)
			logger.Info("SEED: Выполняем: %s", q)
			if err := tx.Exec(q).Error; err != nil {
				logger.Error("SEED: Ошибка обновления последовательности %s: %v", seqName, err)
				return fmt.Errorf("ошибка обновления последовательности %s: %v", seqName, err)
			}
		}

		logger.Info("SEED: Транзакция успешно завершена")
		return nil
	})

	if err != nil {
		return err
	}

	logger.Info("=== SEED: Загрузка тестовых данных завершена успешно ===")
	return nil
}
