package database

import (
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/daniildddd/DbMireaGolang/internal/models"
)

// пересоздает таблицы в базе данных, удаляет существующие таблицы и типы, затем создает новые
//
// падает с паникой в случае если не смогли удалить таблику/создать табличку
func MustCreateTables() {
	logger.Logger.Info("!!! начало пересоздания таблиц !!!")

	//удаляем существующие таблицы в таком порядке что сначала удаляются дочерние, потом родительские
	tables := []string{"sales", "inventory", "production_batches", "products"}
	for _, table := range tables {
		if DB.Migrator().HasTable(table) {
			logger.Logger.Info("удаление таблицы dbname=%s", table)
			if err := DB.Migrator().DropTable(table); err != nil {
				logger.Logger.Error("ошибка удаления таблицы dbname=%s err=%v", table, err)
				panic(err)
			}
			logger.Logger.Info("успешно удалена табличка dbname=%s", table)
		}
	}

	//создаем таблицы в правильном порядке
	logger.Logger.Info("Создание таблиц")
	err := DB.AutoMigrate(&models.Product{}, &models.ProductionBatch{},
		&models.Inventory{}, models.Sale{})
	if err != nil {
		logger.Logger.Error("!!! ОШИБКА СОЗДАНИЯ ТАБЛИЦ: %v!!!", err)
		panic(err)
	}
	logger.Logger.Info("таблицы успешно созданы")
}
