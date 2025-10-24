export namespace Api {
  interface GenericResponse {
    success: boolean;
    message: string;
    error: string;
  }

  export interface TableNamesResponse {
    tableName: string[];
  }

  export interface TableInfo {
    name: string; // это прям имя таблицы, можно будет дальше прокидывать в другие функции
    displayName?: string; // как выглядит название таблицы на Фронте
  }

  export interface InsertRequest {
    tableName: string;
  }

  export interface FieldInfo {
    name: string;
    type: string;
    isNullable: boolean;
    isAutoIncrement: boolean;
    enumValues: string[];
    error: string;
  }

  export interface TableSchemaRequest {
    name: string;
  }

  interface FieldSchema {
    name: string;
    type: string;
    constraints: string; // вся строка с ограничениями, ты ее просто выводишь и все,я на беке ее соберу
  }

  export type FieldSchemaResponse = FieldSchema[];

  export interface DeleteFieldRequest {
    name: string;
  }

  export type DeleteFieldResponse = GenericResponse;

  export interface EditRequest {
    name: string;
    type: string;
    primaryKey: boolean;
    foreignKey: boolean;
    notNull: boolean;
    unique: boolean;
    autoIncrement: boolean;
    check: string;
    default: string;
  }

  export type EditResponse = GenericResponse;
}
