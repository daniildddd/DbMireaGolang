//go:generate go run github.com/wailsapp/wails/v2/cmd/wails generate module

package main

import (
	"context"
	"embed"
	"fmt"

	"github.com/daniildddd/DbMireaGolang/config"
	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/logger"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:internal/ui/frontend/dist
var assets embed.FS

type App struct {
	ctx context.Context
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}

func NewApp() *App {
	return &App{}
}

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

	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "DbMireaGolang",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
