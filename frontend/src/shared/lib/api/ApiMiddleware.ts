import {
  RecreateTables,
  GetTableNamesFromModels,
  GetTableSchema,
  DeleteField,
  UpdateField,
  ExecuteCustomQuery,
  GetTableData,
  SearchInTable,
  ExecuteJoinQuery,
  GetTablesMetadata,
} from "wailsjs";
import { main } from "../wailsjs/go/models";

export default class ApiMiddleware {
  // Таблицы и схема
  static async recreateTables(): Promise<main.RecreateTablesResult> {
    return RecreateTables();
  }

  static async getTableSchema(tableName: string): Promise<main.FieldSchema[]> {
    return GetTableSchema(tableName);
  }

  static async getTableNames(): Promise<main.TablesListResponse> {
    return GetTableNamesFromModels();
  }

  static async getTableMetadata(): Promise<main.TableMetadata[]> {
    return GetTablesMetadata();
  }

  static async deleteTableFieldByName(
    request: main.DeleteFieldRequest
  ): Promise<main.RecreateTablesResult> {
    return DeleteField(request);
  }

  static async updateTableField(
    request: main.UpdateFieldRequest
  ): Promise<main.RecreateTablesResult> {
    return UpdateField(request);
  }

  // Данные из таблиц
  static async getTableData(
    tableName: string
  ): Promise<main.TableDataResponse> {
    return GetTableData(tableName);
  }

  // SQL запросы
  static async executeCustomQuery(
    query: string
  ): Promise<main.TableDataResponse> {
    return ExecuteCustomQuery({ query });
  }

  static async searchInTable(
    request: main.SearchRequest
  ): Promise<main.TableDataResponse> {
    return SearchInTable(request);
  }

  static async executeJoinQuery(
    request: main.JoinRequest
  ): Promise<main.TableDataResponse> {
    return ExecuteJoinQuery(request);
  }
}
