package main

import (
	"context"
	"strings"
	"time"

	"github.com/daniildddd/DbMireaGolang/internal/database"
	"github.com/daniildddd/DbMireaGolang/internal/logger"
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
		logger.Logger.Error("Table %s not found: %v", tableName, err)
		return []FieldSchema{}
	}

	// Получаем все ограничения одним запросом
	type Constraint struct {
		Column     string
		Type       string
		Definition string
	}

	var constraints []Constraint
	database.DB.Raw(`
        SELECT 
            kcu.column_name as column,
            tc.constraint_type as type,
            CASE 
                WHEN tc.constraint_type = 'FOREIGN KEY' THEN 
                    ccu.table_name || '(' || ccu.column_name || ')'
                WHEN tc.constraint_type = 'CHECK' THEN 
                    cc.check_clause
                ELSE ''
            END as definition
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name 
            AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage ccu 
            ON tc.constraint_name = ccu.constraint_name
        LEFT JOIN information_schema.check_constraints cc 
            ON tc.constraint_name = cc.constraint_name
        WHERE tc.table_name = $1 
            AND tc.table_schema = 'public'
            AND tc.constraint_type IN ('FOREIGN KEY', 'UNIQUE', 'CHECK')
    `, tableName).Scan(&constraints)

	// Группируем ограничения по колонкам
	consMap := make(map[string][]string)
	var tableChecks []string // CHECK на уровне таблицы

	for _, c := range constraints {
		switch c.Type {
		case "FOREIGN KEY":
			consMap[c.Column] = append(consMap[c.Column], "foreign key references "+c.Definition)
		case "UNIQUE":
			consMap[c.Column] = append(consMap[c.Column], "unique")
		case "CHECK":
			if c.Column != "" {
				// CHECK для конкретной колонки
				consMap[c.Column] = append(consMap[c.Column], "check: "+c.Definition)
			} else {
				// CHECK на уровне таблицы - нужно парсить
				tableChecks = append(tableChecks, c.Definition)
			}
		}
	}

	// Пытаемся распарсить table-level CHECK constraints
	for _, check := range tableChecks {
		// Простой парсинг: ищем имя колонки в начале выражения
		// Например: "age >= 18" или "(age >= 18)"
		check = strings.Trim(check, "()")
		parts := strings.Fields(check)
		if len(parts) > 0 {
			colName := parts[0]
			// Проверяем, что это реальная колонка
			for _, col := range columns {
				if col.Name() == colName {
					consMap[colName] = append(consMap[colName], "check: "+check)
					break
				}
			}
		}
	}

	// Собираем финальный результат
	var fields []FieldSchema
	for _, col := range columns {
		name := col.Name()
		colType, _ := col.ColumnType()
		nullable, _ := col.Nullable()
		pk, _ := col.PrimaryKey()

		var cons []string

		if pk {
			cons = append(cons, "primary key")
		}

		if !nullable {
			cons = append(cons, "not null")
		}

		cons = append(cons, consMap[name]...)

		fields = append(fields, FieldSchema{
			Name:        name,
			Type:        strings.ToLower(colType),
			Constraints: strings.Join(cons, ", "),
		})
	}

	return fields
}

// структура для возврата данных таблицы
type TableDataResponse struct {
	Columns []string                 `json:"columns"`
	Rows    []map[string]interface{} `json:"rows"`
	Error   string                   `json:"error,omitempty"`
}

// получает данные из указанной таблицы
//
// принимает имя таблички, возвращает название колонок и строчки таблицы
//
// в случае ощибки вернется дополнительное поле Error, иначе этого поля не будет(свойство json omitempty)
func (a *App) GetTableData(tableName string) TableDataResponse {
	if database.DB == nil {
		return TableDataResponse{
			Error: "База данных не инициализирована",
		}
	}

	// Проверяем существование таблицы
	if !database.DB.Migrator().HasTable(tableName) {
		return TableDataResponse{
			Error: "Таблица не найдена",
		}
	}

	// Получаем информацию о колонках
	columns, err := database.DB.Migrator().ColumnTypes(tableName)
	if err != nil {
		logger.Logger.Error("Ошибка получения колонок таблицы %s: %v", tableName, err)
		return TableDataResponse{
			Error: "Не удалось получить структуру таблицы",
		}
	}

	// Формируем список имен колонок
	var columnNames []string
	for _, col := range columns {
		columnNames = append(columnNames, col.Name())
	}

	// Получаем данные из таблицы
	var rows []map[string]interface{}
	result := database.DB.Table(tableName).Find(&rows)

	if result.Error != nil {
		logger.Logger.Error("Ошибка получения данных из таблицы %s: %v", tableName, result.Error)
		return TableDataResponse{
			Error: "Не удалось получить данные таблицы",
		}
	}

	// GORM возвращает time.Time, который нужно преобразовать в строку и отформатировать
	for i := range rows {
		for key, value := range rows[i] {
			if t, ok := value.(time.Time); ok {
				rows[i][key] = t.Format("2006-01-02 15:04:05")
			}
		}
	}

	return TableDataResponse{
		Columns: columnNames,
		Rows:    rows,
	}
}
