import {
  RecreateTables,
  GetTableNamesFromModels,
  GetTableSchema,
} from "wailsjs";
import { main } from "../wailsjs/go/models";

export default class ApiMiddleware {
  static async recreateTables(): Promise<main.RecreateTablesResult> {
    return RecreateTables();
  }

  static async getTableSchema(tableName: string): Promise<main.FieldSchema[]> {
    return GetTableSchema(tableName);
  }

  static getTableNames(): Promise<main.TablesListResponse> {
    return GetTableNamesFromModels();
  }
}
