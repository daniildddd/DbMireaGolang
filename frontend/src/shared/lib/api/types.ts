export namespace Api {
  interface GenericResponse {
    success: boolean;
    message: string;
    error: string;
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

  export type CreateTablesResponse = GenericResponse;

  export interface TableSchemaRequest {
    name: string;
  }

  export interface TableSchemaResponse {
    columns: string[];
    rows: string[];
    error: string;
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
