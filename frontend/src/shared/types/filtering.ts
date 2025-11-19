export enum FilterType {
  where,
  groupBy,
  orderBy,
  having,
  aggregate,
  subquery,
  regex,
  caseQuery,
  nullHandleRule,
}

export interface Filters {
  [FilterType.where]: string[];
  [FilterType.groupBy]: string[];
  [FilterType.orderBy]: string[];
  [FilterType.having]: string[];
  [FilterType.aggregate]: string[];
  [FilterType.subquery]: string[];
  [FilterType.regex]: string[];
  [FilterType.caseQuery]: string[];
  [FilterType.nullHandleRule]: string[];
}
