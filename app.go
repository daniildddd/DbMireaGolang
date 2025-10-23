package main

import (
	"context"

	"github.com/daniildddd/DbMireaGolang/internal/database"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// todo: добавить комментарии в docs style
type RecreateTablesResult struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

// todo: добавить комментарии в docs style
func (a *App) RecreateTables() RecreateTablesResult {
	err := database.CreateTables()

	if err != nil {
		return RecreateTablesResult{
			Success: false,
			Message: "Не удалось пересоздать таблицы",
			Error:   err.Error(),
		}
	}

	return RecreateTablesResult{
		Success: true,
		Message: "Таблицы успешно пересозданы",
	}
}
