import {
  RecreateTables,
  GetTableNamesFromModels,
  GetTableSchema,
} from "wailsjs";
import { Api } from "./types";
import { main } from "../wailsjs/go/models";

export default class ApiMiddleware {
  static async recreateTables(): Promise<main.RecreateTablesResult> {
    return RecreateTables();
  }

  static async getTableFields(tableName: string): Promise<Api.TableInfo> {
    const request: Api.TableSchemaRequest = { name: tableName };
    return { name: "" };
  }

  static async getTableSchema(tableName: string): Promise<main.FieldSchema[]> {
    return GetTableSchema(tableName);
  }

  static getTableNames(): Promise<main.TablesListResponse> {
    return GetTableNamesFromModels();
  }
}
