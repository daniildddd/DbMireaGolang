package database

import (
	"fmt"

	"github.com/daniildddd/DbMireaGolang/config"
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// глобальная переменная для соединения с базой данных(именно глобальная чтоб использовать во всех пакетах можно было)
var DB *gorm.DB

// подключение к постргрю с использованием параметров из конфигурации
//
// если не удалось подключиться к базе данных то падает с паникой
func MustConnectDB() {
	logger.Logger.Info("=== начало подключения к базе данных ===")

	//получаем значение из .env файла
	host := config.GetEnvWithDefault("DB_HOST", "localhost")
	port := config.GetEnvWithDefault("DB_PORT", "5432")
	dbname := config.GetEnvWithDefault("DB_NAME", "energy_drinks_db")
	user := config.GetEnvWithDefault("DB_USER", "postgres")
	password := config.GetEnvWithDefault("DB_PASSWORD", "password")

	logger.Logger.Info("параметры подключения: host=%s port=%s user=%s dbnamme=%s", host, port, user, dbname)

	//формируем dsn(имя источника данных)
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// открываем соединение
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logger.Logger.Error("ошибка подключения к базе данных %v", err)
		panic(err)
	}
	logger.Logger.Info("успешное подключение к базе данных %s", dbname)
}
