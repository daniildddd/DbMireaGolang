export type TableField = { name: string; type: string };
export type Operator = ">" | "<" | ">=" | "<=" | "!=" | "=";
export interface WhenThenCondition {
  fieldName: string;
  operator: Operator;
  value: string;
  resultingValue: string;
}

/* SQL */
export type NumericSqlDataTypes = "bigint" | "numeric";
export type TimestampSqlDataTypes = "timestamp with time zone" | "timestamp";
export type SqlDataTypes = "text" | NumericSqlDataTypes | TimestampSqlDataTypes;