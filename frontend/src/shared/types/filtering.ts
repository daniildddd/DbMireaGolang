export enum FilterType {
  where,
  groupBy,
  orderBy,
  having,
  aggregate,
  subquery,
  regex,
  caseQuery,
  nullHandlingRule,
}

export type Filters = {
  [key in FilterType]?: string[];
};