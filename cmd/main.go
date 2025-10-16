package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"

	"github.com/daniildddd/DbMireaGolang/config"
	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/frontend"
	"github.com/daniildddd/DbMireaGolang/internal/logger"

)

// todo: логи изменить, более логично будет под каждый запуск лог файл создавать
func main() {
	// Инициализация логгера (в итоге он будет глобальным)
	logger.InitLogger()

	// Загрузка переменных окружения из .env
	config.MustLoad()

	// Подключение к PostgreSQL (инициализация глобальной DB)
	database.MustConnectDB()

	/* Миграция таблиц
	if err := database.MigrateDB(database.DB); err != nil {
		panic("failed to migrate database: " + err.Error())
	}*/

	// Инициализация Fyne приложения
	myApp := app.New()
	window := myApp.NewWindow("Energy Drinks Manager")

	// Создание WindowManager
	wm := frontend.NewWindowManager(myApp, window)

	// Отображение главного меню через WindowManager
	wm.ShowMainMenu()

	// Установка минимального размера окна
	window.Resize(fyne.NewSize(600, 400))

	// Запуск приложения
	window.ShowAndRun()
}
