export enum FilterType {
  where,
  groupBy,
  orderBy,
  having,
  aggregate,
}

export interface Filters {
  [FilterType.where]: string[];
  [FilterType.groupBy]: string[];
  [FilterType.orderBy]: string[];
  [FilterType.having]: string[];
  [FilterType.aggregate]: string[];
}
