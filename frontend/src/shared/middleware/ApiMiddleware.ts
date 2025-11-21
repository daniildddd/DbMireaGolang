import * as wails from "wailsjs";
import { main } from "../lib/wailsjs/go/models";

export default class ApiMiddleware {
  static async recreateTables(): Promise<main.RecreateTablesResult> {
    return wails.RecreateTables();
  }

  static async getTableSchema(tableName: string): Promise<main.FieldSchema[]> {
    return wails.GetTableSchema(tableName);
  }

  static async getTableNames(): Promise<main.TablesListResponse> {
    return wails.GetTableNamesFromModels();
  }

  static async deleteTableFieldByName(
    request: main.DeleteFieldRequest
  ): Promise<main.RecreateTablesResult> {
    return wails.DeleteField(request);
  }

  static async getDataByCustomQuery(
    request: main.CustomQueryRequest
  ): Promise<main.TableDataResponse> {
    return wails.ExecuteCustomQuery(request);
  }
}

// // SearchInTable - выполняет поиск по таблице с использованием LIKE или регулярных выражений
// func (a *App) SearchInTable(req SearchRequest) TableDataResponse

// // SearchRequest — запрос, отправляемый с фронта для выполнения поиска
// type SearchRequest struct {
//  TableName string       `json:"tableName"`
//  Filters   SearchFilter `json:"filters"`
// }

// // SearchFilter — единичное условие поиска для одной колонки
// type SearchFilter struct {
//  FieldName string         `json:"fieldName"` // Имя колонки для поиска
//  Operator  SearchOperator `json:"operator"`  // Выбранный оператор
//  Value     string         `json:"value"`     // Шаблон/регулярное выражение для поиска
// }

// // SearchOperator — перечисление доступных операторов поиска
// type SearchOperator string

// const (
//  LikeOperator       SearchOperator = "LIKE" // Регистрозависимый LIKE
//  RegexpOperator     SearchOperator = "~"    // Соответствует регулярному выражению
//  IRegexpOperator    SearchOperator = "~*"   // Соответствует регулярному выражению
//  NotRegexpOperator  SearchOperator = "!~"   // НЕ соответствует регулярному выражению
//  NotIRegexpOperator SearchOperator = "!~*"  // НЕ соответствует регулярному выражению
// )

// type TableDataResponse struct {
//  Columns []string                 `json:"columns"`
//  Rows    []map[string]interface{} `json:"rows"`
//  Error   string                   `json:"error,omitempty"`
// }
