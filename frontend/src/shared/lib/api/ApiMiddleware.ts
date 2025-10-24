import { RecreateTables, GetTableNamesFromModels } from "wailsjs";
import { Api } from "./types";

export default class ApiMiddleware {
  static async recreateTables(): Promise<Api.CreateTablesResponse> {
    return RecreateTables() as Promise<Api.CreateTablesResponse>;
  }

  // static async getTableFields(tableName: string): Promise<Api.TableInfo> {
  //   const request: Api.TableSchemaRequest = { name: tableName };
  // }

  // static async getTableSchema(
  //   tableName: string
  // ): Promise<Api.TableSchemaResponse> {
  //   const request: Api.TableSchemaRequest = { name: tableName };
  //   const response: Api.TableSchemaResponse =
  // }

  static getTableNames(): Promise<Api.TableNamesResponse> {
    return GetTableNamesFromModels();
  }
}
