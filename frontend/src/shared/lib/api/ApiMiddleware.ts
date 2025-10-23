import { RecreateTables } from "wailsjs";

export default class ApiMiddleware {
  static async recreateTables() {
    return RecreateTables();
  }

  static getTableNames(): string[] {
    return [];
  }
}
