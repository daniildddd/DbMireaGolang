//go:generate go run github.com/wailsapp/wails/v2/cmd/wails generate module
package main

import (
	"embed"

	"github.com/daniildddd/DbMireaGolang/config"
	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Инициализация логгера (в итоге он будет глобальным) + обработка ошибки создания логгера
	if err := logger.InitLogger(); err != nil {
		panic("Failed to initialize logger: " + err.Error())
	}

	// Загрузка переменных окружения из .env
	config.MustLoad()

	// Подключение к PostgreSQL (инициализация глобальной DB)
	database.MustConnectDB()

	// если не смогли создать/пересоздать таблицы то падаем с паникой
	if err := database.CreateTables(); err != nil {
		panic("failed to migrate database: " + err.Error())
	}
	app := NewApp()

	err := wails.Run(&options.App{
		Title:             "DbMireaGolang",
		Width:             1280,
		Height:            800,
		WindowStartState:  1, // Maximized
		MinWidth:          1280,
		MinHeight:         800,
		Fullscreen:        false,
		Frameless:         false,
		StartHidden:       false,
		HideWindowOnClose: false,
		BackgroundColour:  &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		Bind: []any{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
