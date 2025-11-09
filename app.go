package main

import (
	"context"
	"fmt"
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

type TableMetadata struct {
	Name   string      `json:"name"`
	Fields []FieldInfo `json:"fields"`
}

type CustomQueryRequest struct {
	Query string `json:"query"`
}

// Новые типы для JOIN функциональности
type JoinType string

const (
	InnerJoin JoinType = "INNER"
	LeftJoin  JoinType = "LEFT"
	RightJoin JoinType = "RIGHT"
	FullJoin  JoinType = "FULL"
)

type JoinConfig struct {
	Table string   `json:"table"`
	Type  JoinType `json:"type"`
	Field string   `json:"field"`
}

type JoinRequest struct {
	MainTable string       `json:"mainTable"`
	MainField string       `json:"mainField"`
	Joins     []JoinConfig `json:"joins"`
}

// SearchRequest — запрос, отправляемый с фронта для выполнения поиска
type SearchRequest struct {
	TableName string       `json:"tableName"`
	Filters   SearchFilter `json:"filters"`
}

// SearchFilter — единичное условие поиска для одной колонки
type SearchFilter struct {
	FieldName string         `json:"fieldName"` // Имя колонки для поиска
	Operator  SearchOperator `json:"operator"`  // Выбранный оператор
	Value     string         `json:"value"`     // Шаблон/регулярное выражение для поиска
}

// SearchOperator — перечисление доступных операторов поиска
type SearchOperator string

const (
	LikeOperator       SearchOperator = "LIKE" // Регистрозависимый LIKE
	RegexpOperator     SearchOperator = "~"    // Соответствует регулярному выражению (регистрозависимый)
	IRegexpOperator    SearchOperator = "~*"   // Соответствует регулярному выражению (регистроНЕзависимый)
	NotRegexpOperator  SearchOperator = "!~"   // НЕ соответствует регулярному выражению (регистрозависимый)
	NotIRegexpOperator SearchOperator = "!~*"  // НЕ соответствует регулярному выражению (регистроНЕзависимый)
)

// RenameTableRequest - запрос на переименование таблицы
type RenameTableRequest struct {
	OldName string `json:"oldName"`
	NewName string `json:"newName"`
}

// DeleteFieldRequest - запрос на удаление поля
type DeleteFieldRequest struct {
	TableName string `json:"tableName"`
	FieldName string `json:"fieldName"`
}

// UpdateFieldRequest - запрос на изменение поля
type UpdateFieldRequest struct {
	TableName   string           `json:"tableName"`
	OldName     string           `json:"oldName"`
	NewName     string           `json:"newName"`
	Type        string           `json:"type"`
	Constraints FieldConstraints `json:"constraints"`
}

// FieldConstraints - ограничения для поля
type FieldConstraints struct {
	NotNull    bool                  `json:"notNull"`
	Unique     bool                  `json:"unique"`
	Check      string                `json:"check,omitempty"`
	ForeignKey *ForeignKeyConstraint `json:"foreignKey,omitempty"`
}

// ForeignKeyConstraint - детали внешнего ключа
type ForeignKeyConstraint struct {
	RefTable   string   `json:"refTable"`
	RefColumns []string `json:"refColumns"`
	OnDelete   string   `json:"onDelete,omitempty"`
	OnUpdate   string   `json:"onUpdate,omitempty"`
}

// SearchInTable - выполняет поиск по таблице с использованием LIKE или регулярных выражений
func (a *App) SearchInTable(req SearchRequest) TableDataResponse {
	if database.DB == nil {
		return TableDataResponse{Error: "База данных не инициализирована"}
	}

	if req.TableName == "" {
		return TableDataResponse{Error: "Название таблицы не указано"}
	}

	if !database.DB.Migrator().HasTable(req.TableName) {
		return TableDataResponse{Error: fmt.Sprintf("Таблица '%s' не найдена", req.TableName)}
	}

	if req.Filters.FieldName == "" {
		return TableDataResponse{Error: "Не указано поле для поиска"}
	}

	if req.Filters.Value == "" {
		return TableDataResponse{Error: "Не указано значение для поиска"}
	}

	// Проверяем существование поля
	if !database.DB.Migrator().HasColumn(req.TableName, req.Filters.FieldName) {
		return TableDataResponse{Error: fmt.Sprintf("Поле '%s' не найдено в таблице '%s'", req.Filters.FieldName, req.TableName)}
	}

	// Валидация оператора
	validOperators := map[SearchOperator]bool{
		LikeOperator:       true,
		RegexpOperator:     true,
		IRegexpOperator:    true,
		NotRegexpOperator:  true,
		NotIRegexpOperator: true,
	}
	if !validOperators[req.Filters.Operator] {
		return TableDataResponse{Error: fmt.Sprintf("Недопустимый оператор поиска: %s", req.Filters.Operator)}
	}

	// Формируем SQL-запрос
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s %s ?",
		req.TableName,
		req.Filters.FieldName,
		req.Filters.Operator)

	logger.Info("Executing search query: %s with value: %s", query, req.Filters.Value)

	var rows []map[string]interface{}
	result := database.DB.Raw(query, req.Filters.Value).Scan(&rows)
	if result.Error != nil {
		logger.Error("SearchInTable error: %v\nQuery: %s\nValue: %s", result.Error, query, req.Filters.Value)
		return TableDataResponse{Error: result.Error.Error()}
	}

	if len(rows) == 0 {
		return TableDataResponse{
			Columns: []string{},
			Rows:    []map[string]interface{}{},
		}
	}

	// Получаем названия колонок из первой строки
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

	logger.Info("Search completed: found %d rows", len(rows))

	return TableDataResponse{
		Columns: cols,
		Rows:    rows,
	}
}

// RenameTable - переименование таблицы
func (a *App) RenameTable(req RenameTableRequest) RecreateTablesResult {
	if database.DB == nil {
		return RecreateTablesResult{
			Success: false,
			Message: "База данных не инициализирована",
			Error:   "database not initialized",
		}
	}

	if req.OldName == "" || req.NewName == "" {
		return RecreateTablesResult{
			Success: false,
			Message: "Необходимо указать старое и новое имя таблицы",
			Error:   "empty table names",
		}
	}

	if !database.DB.Migrator().HasTable(req.OldName) {
		return RecreateTablesResult{
			Success: false,
			Message: fmt.Sprintf("Таблица '%s' не найдена", req.OldName),
			Error:   "table not found",
		}
	}

	if database.DB.Migrator().HasTable(req.NewName) {
		return RecreateTablesResult{
			Success: false,
			Message: fmt.Sprintf("Таблица '%s' уже существует", req.NewName),
			Error:   "table already exists",
		}
	}

	err := database.DB.Exec(fmt.Sprintf("ALTER TABLE %s RENAME TO %s", req.OldName, req.NewName)).Error
	if err != nil {
		logger.Error("Ошибка переименования таблицы %s -> %s: %v", req.OldName, req.NewName, err)
		return RecreateTablesResult{
			Success: false,
			Message: "Не удалось переименовать таблицу",
			Error:   err.Error(),
		}
	}

	logger.Info("Таблица успешно переименована: %s -> %s", req.OldName, req.NewName)
	return RecreateTablesResult{
		Success: true,
		Message: fmt.Sprintf("Таблица '%s' переименована в '%s'", req.OldName, req.NewName),
	}
}

// DeleteField - удаление поля из таблицы
func (a *App) DeleteField(req DeleteFieldRequest) RecreateTablesResult {
	if database.DB == nil {
		return RecreateTablesResult{
			Success: false,
			Message: "База данных не инициализирована",
			Error:   "database not initialized",
		}
	}

	if req.TableName == "" || req.FieldName == "" {
		return RecreateTablesResult{
			Success: false,
			Message: "Необходимо указать имя таблицы и имя поля",
			Error:   "empty table or field name",
		}
	}

	if !database.DB.Migrator().HasTable(req.TableName) {
		return RecreateTablesResult{
			Success: false,
			Message: fmt.Sprintf("Таблица '%s' не найдена", req.TableName),
			Error:   "table not found",
		}
	}

	// Проверяем существование поля
	if !database.DB.Migrator().HasColumn(req.TableName, req.FieldName) {
		return RecreateTablesResult{
			Success: false,
			Message: fmt.Sprintf("Поле '%s' не найдено в таблице '%s'", req.FieldName, req.TableName),
			Error:   "column not found",
		}
	}

	err := database.DB.Migrator().DropColumn(req.TableName, req.FieldName)
	if err != nil {
		logger.Error("Ошибка удаления поля %s.%s: %v", req.TableName, req.FieldName, err)
		return RecreateTablesResult{
			Success: false,
			Message: "Не удалось удалить поле",
			Error:   err.Error(),
		}
	}

	logger.Info("Поле успешно удалено: %s.%s", req.TableName, req.FieldName)
	return RecreateTablesResult{
		Success: true,
		Message: fmt.Sprintf("Поле '%s' успешно удалено из таблицы '%s'", req.FieldName, req.TableName),
	}
}

// UpdateField - изменение поля (имя, тип, ограничения)
func (a *App) UpdateField(req UpdateFieldRequest) RecreateTablesResult {
	if database.DB == nil {
		return RecreateTablesResult{
			Success: false,
			Message: "База данных не инициализирована",
			Error:   "database not initialized",
		}
	}

	if req.TableName == "" || req.OldName == "" || req.NewName == "" {
		return RecreateTablesResult{
			Success: false,
			Message: "Необходимо указать имя таблицы, старое и новое имя поля",
			Error:   "empty table or field names",
		}
	}

	if !database.DB.Migrator().HasTable(req.TableName) {
		return RecreateTablesResult{
			Success: false,
			Message: fmt.Sprintf("Таблица '%s' не найдена", req.TableName),
			Error:   "table not found",
		}
	}

	if !database.DB.Migrator().HasColumn(req.TableName, req.OldName) {
		return RecreateTablesResult{
			Success: false,
			Message: fmt.Sprintf("Поле '%s' не найдено в таблице '%s'", req.OldName, req.TableName),
			Error:   "column not found",
		}
	}

	// Начинаем транзакцию
	tx := database.DB.Begin()
	if tx.Error != nil {
		return RecreateTablesResult{
			Success: false,
			Message: "Не удалось начать транзакцию",
			Error:   tx.Error.Error(),
		}
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// 1. Переименование поля (если имя изменилось)
	if req.OldName != req.NewName {
		err := tx.Exec(fmt.Sprintf("ALTER TABLE %s RENAME COLUMN %s TO %s",
			req.TableName, req.OldName, req.NewName)).Error
		if err != nil {
			tx.Rollback()
			logger.Error("Ошибка переименования поля %s.%s -> %s: %v", req.TableName, req.OldName, req.NewName, err)
			return RecreateTablesResult{
				Success: false,
				Message: "Не удалось переименовать поле",
				Error:   err.Error(),
			}
		}
		logger.Info("Поле переименовано: %s.%s -> %s", req.TableName, req.OldName, req.NewName)
	}

	// 2. Изменение типа данных
	err := tx.Exec(fmt.Sprintf("ALTER TABLE %s ALTER COLUMN %s TYPE %s",
		req.TableName, req.NewName, req.Type)).Error
	if err != nil {
		tx.Rollback()
		logger.Error("Ошибка изменения типа поля %s.%s: %v", req.TableName, req.NewName, err)
		return RecreateTablesResult{
			Success: false,
			Message: "Не удалось изменить тип поля",
			Error:   err.Error(),
		}
	}

	// 3. Обработка NOT NULL
	if req.Constraints.NotNull {
		err = tx.Exec(fmt.Sprintf("ALTER TABLE %s ALTER COLUMN %s SET NOT NULL",
			req.TableName, req.NewName)).Error
		if err != nil {
			tx.Rollback()
			logger.Error("Ошибка добавления NOT NULL для %s.%s: %v", req.TableName, req.NewName, err)
			return RecreateTablesResult{
				Success: false,
				Message: "Не удалось добавить ограничение NOT NULL",
				Error:   err.Error(),
			}
		}
	} else {
		// Убираем NOT NULL если он был
		tx.Exec(fmt.Sprintf("ALTER TABLE %s ALTER COLUMN %s DROP NOT NULL",
			req.TableName, req.NewName))
	}

	// 4. Обработка UNIQUE
	if req.Constraints.Unique {
		constraintName := fmt.Sprintf("unique_%s_%s", req.TableName, req.NewName)
		err = tx.Exec(fmt.Sprintf("ALTER TABLE %s ADD CONSTRAINT %s UNIQUE (%s)",
			req.TableName, constraintName, req.NewName)).Error
		if err != nil && !strings.Contains(err.Error(), "already exists") {
			tx.Rollback()
			logger.Error("Ошибка добавления UNIQUE для %s.%s: %v", req.TableName, req.NewName, err)
			return RecreateTablesResult{
				Success: false,
				Message: "Не удалось добавить ограничение UNIQUE",
				Error:   err.Error(),
			}
		}
	}

	// 5. Обработка CHECK
	if req.Constraints.Check != "" {
		constraintName := fmt.Sprintf("check_%s_%s", req.TableName, req.NewName)
		err = tx.Exec(fmt.Sprintf("ALTER TABLE %s ADD CONSTRAINT %s CHECK (%s)",
			req.TableName, constraintName, req.Constraints.Check)).Error
		if err != nil && !strings.Contains(err.Error(), "already exists") {
			tx.Rollback()
			logger.Error("Ошибка добавления CHECK для %s.%s: %v", req.TableName, req.NewName, err)
			return RecreateTablesResult{
				Success: false,
				Message: "Не удалось добавить ограничение CHECK",
				Error:   err.Error(),
			}
		}
	}

	// 6. Обработка FOREIGN KEY
	if req.Constraints.ForeignKey != nil {
		fk := req.Constraints.ForeignKey
		constraintName := fmt.Sprintf("fk_%s_%s", req.TableName, req.NewName)

		refColumns := strings.Join(fk.RefColumns, ", ")
		fkSQL := fmt.Sprintf("ALTER TABLE %s ADD CONSTRAINT %s FOREIGN KEY (%s) REFERENCES %s(%s)",
			req.TableName, constraintName, req.NewName, fk.RefTable, refColumns)

		if fk.OnDelete != "" {
			fkSQL += fmt.Sprintf(" ON DELETE %s", fk.OnDelete)
		}
		if fk.OnUpdate != "" {
			fkSQL += fmt.Sprintf(" ON UPDATE %s", fk.OnUpdate)
		}

		err = tx.Exec(fkSQL).Error
		if err != nil && !strings.Contains(err.Error(), "already exists") {
			tx.Rollback()
			logger.Error("Ошибка добавления FOREIGN KEY для %s.%s: %v", req.TableName, req.NewName, err)
			return RecreateTablesResult{
				Success: false,
				Message: "Не удалось добавить внешний ключ",
				Error:   err.Error(),
			}
		}
	}

	// Фиксируем транзакцию
	if err := tx.Commit().Error; err != nil {
		logger.Error("Ошибка фиксации изменений для %s.%s: %v", req.TableName, req.NewName, err)
		return RecreateTablesResult{
			Success: false,
			Message: "Не удалось зафиксировать изменения",
			Error:   err.Error(),
		}
	}

	logger.Info("Поле успешно изменено: %s.%s", req.TableName, req.NewName)
	return RecreateTablesResult{
		Success: true,
		Message: fmt.Sprintf("Поле '%s' успешно изменено", req.NewName),
	}
}

// ручка для создания/пересоздания табличек
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

// ручка для получения всех табличек(их названий)
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

// ручка для получения информации об ограниченях на поля таблички
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

// ручка для получения записей в табличке
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

// ручка для получения всех полей(используется в окне вставке данных)
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

// Возвращает метаданные всех таблиц
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

// выполняет SELECT-запрос
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

	var cols []string
	for col := range rows[0] {
		cols = append(cols, col)
	}

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

// Новый метод для выполнения JOIN-запросов
func (a *App) ExecuteJoinQuery(req JoinRequest) TableDataResponse {
	if database.DB == nil {
		return TableDataResponse{Error: "База данных не инициализирована"}
	}

	if req.MainTable == "" {
		return TableDataResponse{Error: "Основная таблица не указана"}
	}

	if !database.DB.Migrator().HasTable(req.MainTable) {
		return TableDataResponse{Error: fmt.Sprintf("Таблица %s не найдена", req.MainTable)}
	}

	if req.MainField == "" {
		return TableDataResponse{Error: "Не указано поле основной таблицы для соединения"}
	}

	if len(req.Joins) == 0 {
		return TableDataResponse{Error: "Не указаны таблицы для соединения"}
	}

	// Проверяем все таблицы для JOIN
	for _, join := range req.Joins {
		if !database.DB.Migrator().HasTable(join.Table) {
			return TableDataResponse{Error: fmt.Sprintf("Таблица %s не найдена", join.Table)}
		}
		if join.Field == "" {
			return TableDataResponse{Error: fmt.Sprintf("Не указано поле для соединения с таблицей %s", join.Table)}
		}
	}

	// Формируем SELECT * (выбираем все поля из всех таблиц)
	query := fmt.Sprintf("SELECT * FROM %s", req.MainTable)

	// Формируем JOIN части с условиями ON
	// mainField соединяется с join.Field для каждого JOIN
	for _, join := range req.Joins {
		condition := fmt.Sprintf("%s.%s = %s.%s", req.MainTable, req.MainField, join.Table, join.Field)
		query += fmt.Sprintf(" %s JOIN %s ON %s", join.Type, join.Table, condition)
	}

	logger.Info("Executing JOIN query: %s", query)

	var rows []map[string]interface{}
	result := database.DB.Raw(query).Scan(&rows)
	if result.Error != nil {
		logger.Error("ExecuteJoinQuery error: %v\nQuery: %s", result.Error, query)
		return TableDataResponse{Error: result.Error.Error()}
	}

	if len(rows) == 0 {
		return TableDataResponse{Columns: []string{}, Rows: []map[string]interface{}{}}
	}

	// Получаем названия колонок из первой строки
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
