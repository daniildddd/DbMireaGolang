package main

import (
	"context"
	"fmt"
	"strings"

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

// нужна для окна отображения характеристике таблички
type FieldSchema struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	Constraints string `json:"constraints"`
}

// выдает схему таблицы
func (a *App) GetTableSchema(tableName string) []FieldSchema {
	if database.DB == nil {
		return []FieldSchema{}
	}

	columns, err := database.DB.Migrator().ColumnTypes(tableName)
	if err != nil {
		return []FieldSchema{}
	}

	var fields []FieldSchema
	for _, col := range columns {
		name := col.Name()
		colType, _ := col.ColumnType()
		dbType := strings.ToLower(colType)

		var constraints []string

		if pk, _ := col.PrimaryKey(); pk {
			c := "primary key"
			if ai, _ := col.AutoIncrement(); ai {
				c += ", auto increment"
			}
			constraints = append(constraints, c)
		}

		if nn, _ := col.Nullable(); !nn {
			constraints = append(constraints, "not null")
		}

		if def, ok := col.DefaultValue(); ok && def != "" {
			def = strings.Trim(def, "'")
			if strings.Contains(dbType, "text") || strings.Contains(dbType, "char") || strings.Contains(dbType, "enum") {
				constraints = append(constraints, fmt.Sprintf("default: '%s'", def))
			} else {
				constraints = append(constraints, "default: "+def)
			}
		}

		fields = append(fields, FieldSchema{
			Name:        name,
			Type:        dbType,
			Constraints: strings.Join(constraints, ", "),
		})
	}

	return fields
}
