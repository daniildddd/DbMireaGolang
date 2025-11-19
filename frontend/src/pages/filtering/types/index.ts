export enum FilterType {
  where,
  groupBy,
  orderBy,
  having,
  aggregate,
  caseWhen,
  subquery,
}

export interface Filters {
  [FilterType.where]: string[];
  [FilterType.groupBy]: string[];
  [FilterType.orderBy]: string[];
  [FilterType.having]: string[];
  [FilterType.aggregate]: string[];
  [FilterType.caseWhen]: string[];
  [FilterType.subquery]: string[];
}
