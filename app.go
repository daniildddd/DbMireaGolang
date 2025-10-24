package main

import (
	"context"

	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/models"
	"gorm.io/gorm"
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

// структура для хранения результатов работы функций
type RecreateTablesResult struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

// удаляет и создает заново все таблицы в базе данных
//
// возвращает ошибкку в случае если не удаллось пересоздать таблицы
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

// список всех табличек
type TablesListResponse struct {
	TableName []string `json:"tableName"`
}

// получение всех табличек через заранее определенные модели, в будущем скорее всего придется передалть
func (a *App) GetTableNamesFromModels() TablesListResponse {
	if database.DB == nil {
		return TablesListResponse{TableName: []string{}}
	}

	migrator := database.DB.Migrator()

	models := []any{
		&models.Product{},
		&models.Inventory{},
		&models.ProductionBatch{},
		&models.Sale{},
	}

	var tables []string
	for _, model := range models {
		if migrator.HasTable(model) {
			stmt := &gorm.Statement{DB: database.DB}
			_ = stmt.Parse(model)
			tables = append(tables, stmt.Table)
		}
	}

	return TablesListResponse{
		TableName: tables,
	}
}
