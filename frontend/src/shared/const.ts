import { Filters, FilterType } from "./types/filtering";

export const EMPTY_FILTERS: Filters = {
  [FilterType.aggregate]: [],
  [FilterType.where]: [],
  [FilterType.having]: [],
  [FilterType.groupBy]: [],
  [FilterType.orderBy]: [],
  [FilterType.subquery]: [],
  [FilterType.caseQuery]: [],
  [FilterType.regex]: [],
  [FilterType.nullHandleRule]: [],
};
