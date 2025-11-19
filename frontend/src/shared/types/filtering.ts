export enum FilterType {
  where,
  groupBy,
  orderBy,
  having,
  aggregate,
  subquery,
}

export interface Filters {
  [FilterType.where]: string[];
  [FilterType.groupBy]: string[];
  [FilterType.orderBy]: string[];
  [FilterType.having]: string[];
  [FilterType.aggregate]: string[];
  [FilterType.subquery]: string[];
}
