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

type InsertRequest struct {
	TableName string `json:"tableName"`
}

type FieldInfo struct {
	Name            string   `json:"name"`
	Type            string   `json:"type"`
	IsNullable      bool     `json:"isNullable"`
	IsAutoIncrement bool     `json:"isAutoIncrement"`
	EnumValues      []string `json:"enumValues,omitempty"`
	Error           string   `json:"error,omitempty"`
}

type InsertRecordRequest struct {
	TableName string                 `json:"tableName"`
	Data      map[string]interface{} `json:"data"`
}

type RecreateTablesResult struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

type TablesListResponse struct {
	TableName []string `json:"tableName"`
}

type FieldSchema struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	Constraints string `json:"constraints"`
}

type TableDataResponse struct {
	Columns []string                 `json:"columns"`
	Rows    []map[string]interface{} `json:"rows"`
	Error   string                   `json:"error,omitempty"`
}

// Метаданные одной таблицы (имя + все поля, которые можно использовать в WHERE)
type TableMetadata struct {
	Name   string      `json:"name"`   // "products"
	Fields []FieldInfo `json:"fields"` // те же FieldInfo, что в GetInsertFormFields
}

// Запрос, который придёт от фронта
type CustomQueryRequest struct {
	Query string `json:"query"` // произвольный SELECT … WHERE …
}

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

func (a *App) GetTableNamesFromModels() TablesListResponse {
	if database.DB == nil {
		return TablesListResponse{TableName: []string{}}
	}

	migrator := database.DB.Migrator()
	modelsList := []any{
		&models.Product{},
		&models.Inventory{},
		&models.ProductionBatch{},
		&models.Sale{},
	}

	var tables []string
	for _, model := range modelsList {
		if migrator.HasTable(model) {
			stmt := &gorm.Statement{DB: database.DB}
			_ = stmt.Parse(model)
			tables = append(tables, stmt.Table)
		}
	}

	return TablesListResponse{TableName: tables}
}

func (a *App) GetTableSchema(tableName string) []FieldSchema {
	if database.DB == nil {
		return []FieldSchema{}
	}

	columns, err := database.DB.Migrator().ColumnTypes(tableName)
	if err != nil {
		logger.Error("Table %s not found: %v", tableName, err)
		return []FieldSchema{}
	}

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

	consMap := make(map[string][]string)
	var tableChecks []string

	for _, c := range constraints {
		switch c.Type {
		case "FOREIGN KEY":
			consMap[c.Column] = append(consMap[c.Column], "foreign key references "+c.Definition)
		case "UNIQUE":
			consMap[c.Column] = append(consMap[c.Column], "unique")
		case "CHECK":
			if c.Column != "" {
				consMap[c.Column] = append(consMap[c.Column], "check: "+c.Definition)
			} else {
				tableChecks = append(tableChecks, c.Definition)
			}
		}
	}

	for _, check := range tableChecks {
		check = strings.Trim(check, "()")
		parts := strings.Fields(check)
		if len(parts) > 0 {
			colName := parts[0]
			for _, col := range columns {
				if col.Name() == colName {
					consMap[colName] = append(consMap[colName], "check: "+check)
					break
				}
			}
		}
	}

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

func (a *App) GetTableData(tableName string) TableDataResponse {
	if database.DB == nil {
		return TableDataResponse{Error: "База данных не инициализирована"}
	}

	if !database.DB.Migrator().HasTable(tableName) {
		return TableDataResponse{Error: "Таблица не найдена"}
	}

	columns, err := database.DB.Migrator().ColumnTypes(tableName)
	if err != nil {
		logger.Error("Ошибка получения колонок таблицы %s: %v", tableName, err)
		return TableDataResponse{Error: "Не удалось получить структуру таблицы"}
	}

	var columnNames []string
	for _, col := range columns {
		columnNames = append(columnNames, col.Name())
	}

	var rows []map[string]interface{}
	result := database.DB.Table(tableName).Find(&rows)
	if result.Error != nil {
		logger.Error("Ошибка получения данных из таблицы %s: %v", tableName, result.Error)
		return TableDataResponse{Error: "Не удалось получить данные таблицы"}
	}

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

func (a *App) GetInsertFormFields(req InsertRequest) []FieldInfo {
	var fields []FieldInfo

	if database.DB == nil {
		return []FieldInfo{{Error: "База данных не инициализирована"}}
	}

	if req.TableName == "" {
		return []FieldInfo{{Error: "Название таблицы не указано"}}
	}

	if !database.DB.Migrator().HasTable(req.TableName) {
		return []FieldInfo{{Error: "Таблица не найдена"}}
	}

	columns, err := database.DB.Migrator().ColumnTypes(req.TableName)
	if err != nil {
		logger.Error("Ошибка получения колонок для формы вставки таблицы %s: %v", req.TableName, err)
		return []FieldInfo{{Error: "Не удалось получить структуру таблицы"}}
	}

	knownEnums := map[string][]string{
		"caffeine_level": {
			string(models.Low),
			string(models.Medium),
			string(models.High),
			string(models.ExtraHigh),
		},
	}

	for _, col := range columns {
		name := col.Name()
		colType, _ := col.ColumnType()
		nullable, _ := col.Nullable()
		autoIncrement, _ := col.AutoIncrement()
		primaryKey, _ := col.PrimaryKey()

		if autoIncrement || (primaryKey && strings.Contains(strings.ToLower(colType), "serial")) {
			continue
		}

		field := FieldInfo{
			Name:            name,
			Type:            strings.ToLower(colType),
			IsNullable:      nullable,
			IsAutoIncrement: autoIncrement,
		}

		if enumVals, exists := knownEnums[name]; exists {
			field.EnumValues = enumVals
			field.Type = "enum"
		}

		fields = append(fields, field)
	}

	if len(fields) == 0 {
		return []FieldInfo{{Error: "Нет доступных полей для вставки"}}
	}

	return fields
}

func (a *App) InsertRecord(req InsertRecordRequest) RecreateTablesResult {
	if database.DB == nil {
		return RecreateTablesResult{
			Success: false,
			Message: "База данных не инициализирована",
			Error:   "database not initialized",
		}
	}

	if req.TableName == "" {
		return RecreateTablesResult{
			Success: false,
			Message: "Название таблицы не указано",
			Error:   "table name empty",
		}
	}

	if !database.DB.Migrator().HasTable(req.TableName) {
		return RecreateTablesResult{
			Success: false,
			Message: "Таблица не найдена",
			Error:   "table not found: " + req.TableName,
		}
	}

	if len(req.Data) == 0 {
		return RecreateTablesResult{
			Success: false,
			Message: "Нет данных для вставки",
			Error:   "empty data",
		}
	}

	// Валидация caffeine_level для products
	if req.TableName == "products" {
		if val, exists := req.Data["caffeine_level"]; exists {
			strVal, ok := val.(string)
			if !ok {
				return RecreateTablesResult{
					Success: false,
					Message: "caffeine_level должен быть строкой",
					Error:   "invalid type for caffeine_level",
				}
			}

			valid := false
			for _, v := range []models.CaffeineLevel{models.Low, models.Medium, models.High, models.ExtraHigh} {
				if string(v) == strVal {
					valid = true
					break
				}
			}
			if !valid {
				return RecreateTablesResult{
					Success: false,
					Message: "Недопустимое значение caffeine_level",
					Error:   "invalid enum value: " + strVal,
				}
			}
		}
	}

	result := database.DB.Table(req.TableName).Create(req.Data)
	if result.Error != nil {
		logger.Error("Ошибка вставки в таблицу %s: %v", req.TableName, result.Error)
		return RecreateTablesResult{
			Success: false,
			Message: "Не удалось добавить запись",
			Error:   result.Error.Error(),
		}
	}

	return RecreateTablesResult{
		Success: true,
		Message: "Запись успешно добавлена",
	}
}

// Возвращает метаданные всех таблиц, чтобы фронт мог построить форму WHERE
func (a *App) GetTablesMetadata() []TableMetadata {
	if database.DB == nil {
		return []TableMetadata{}
	}

	migrator := database.DB.Migrator()
	modelsList := []any{
		&models.Product{},
		&models.Inventory{},
		&models.ProductionBatch{},
		&models.Sale{},
	}

	// todo: в будущем скорее всего придется переделать при масштабировании
	knownEnums := map[string]map[string][]string{
		"products": {
			"caffeine_level": {
				string(models.Low),
				string(models.Medium),
				string(models.High),
				string(models.ExtraHigh),
			},
		},
	}

	var meta []TableMetadata
	for _, m := range modelsList {
		stmt := &gorm.Statement{DB: database.DB}
		if err := stmt.Parse(m); err != nil {
			continue
		}
		table := stmt.Table
		if !migrator.HasTable(table) {
			continue
		}

		cols, err := migrator.ColumnTypes(table)
		if err != nil {
			logger.Error("GetTablesMetadata: columns %s: %v", table, err)
			continue
		}

		var fields []FieldInfo
		tableEnums := knownEnums[table]

		for _, c := range cols {
			name := c.Name()
			colType, _ := c.ColumnType()
			nullable, _ := c.Nullable()
			autoInc, _ := c.AutoIncrement()

			f := FieldInfo{
				Name:            name,
				Type:            strings.ToLower(colType),
				IsNullable:      nullable,
				IsAutoIncrement: autoInc,
			}
			if ev, ok := tableEnums[name]; ok {
				f.EnumValues = ev
				f.Type = "enum"
			}
			fields = append(fields, f)
		}

		if len(fields) > 0 {
			meta = append(meta, TableMetadata{Name: table, Fields: fields})
		}
	}
	return meta
}

// выполняет SELECT-запрос и возвращает TableDataResponse, нужна для сценария когда в окне where уже сформировался запрос и нужно получить результирующую табличку
func (a *App) ExecuteCustomQuery(req CustomQueryRequest) TableDataResponse {
	if database.DB == nil {
		return TableDataResponse{Error: "База данных не инициализирована"}
	}
	if strings.TrimSpace(req.Query) == "" {
		return TableDataResponse{Error: "Запрос пустой"}
	}

	var rows []map[string]interface{}
	result := database.DB.Raw(req.Query).Scan(&rows)
	if result.Error != nil {
		logger.Error("ExecuteCustomQuery error: %v\nQuery: %s", result.Error, req.Query)
		return TableDataResponse{Error: result.Error.Error()}
	}

	if len(rows) == 0 {
		return TableDataResponse{Columns: []string{}, Rows: []map[string]interface{}{}}
	}

	// Колонки берём из первой строки
	var cols []string
	for col := range rows[0] {
		cols = append(cols, col)
	}

	// Приводим time.Time к строке
	for i := range rows {
		for k, v := range rows[i] {
			if t, ok := v.(time.Time); ok {
				rows[i][k] = t.Format("2006-01-02 15:04:05")
			}
		}
	}

	return TableDataResponse{
		Columns: cols,
		Rows:    rows,
	}
}
