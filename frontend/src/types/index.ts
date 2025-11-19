export type TableField = { name: string; type: string };
export type Operator = ">" | "<" | ">=" | "<=" | "!=" | "=";
export interface WhenThenCondition {
  fieldName: string;
  operator: Operator;
  value: string;
  resultingValue: string;
}