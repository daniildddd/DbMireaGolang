import { RecreateTables } from "wailsjs";

export default class ApiMiddleware {
  static async createTables() {
    return RecreateTables();
  }
}
