import { Filters, FilterType } from "@/shared/types/filtering";

type SelectPair = { column: string; as?: string };
type Select = SelectPair[] | "*";

function isFilterTypePresent(filters: Filters, type: FilterType): boolean {
  return filters[type].length > 0;
}

function getFilterIfPresent(
  filterType: FilterType,
  filters: Filters,
  filterName: string = ""
) {
  if (isFilterTypePresent(filters, filterType)) {
    return `\t${filterName.toLocaleUpperCase()} ${filters[filterType].join(
      " AND "
    )}\n`; // TODO: сделать умнее если нужно
  }
}

function getComplexWhereQuery(filters: Filters) {
  let query = `WHERE\n`;

  query += getFilterIfPresent(FilterType.where, filters);
  query += getFilterIfPresent(FilterType.aggregate, filters);
  query += getFilterIfPresent(FilterType.nullHandlingRule, filters);
  query += getFilterIfPresent(FilterType.regex, filters);
  query += getFilterIfPresent(FilterType.subquery, filters);

  return query;
}

function getSelectFromQuery(
  select: Select = "*",
  tableName: string,
  filters: Filters
): string {
  let query =
    select === "*"
      ? "SELECT * "
      : `${select
          .map((pair) => `${pair.column}${pair?.as}`)
          .join(", ")} FROM ${tableName}`;

  if (
    [
      FilterType.where,
      FilterType.aggregate,
      FilterType.nullHandlingRule,
      FilterType.regex,
      FilterType.subquery,
    ].some((type) => isFilterTypePresent(filters, type))
  ) {
    query += getComplexWhereQuery(filters);
  }

  query += `\tFROM ${tableName}`;
  return query;
}

export function generateSqlQuery(
  select: Select = "*",
  tableName: string,
  filters: Filters
) {
  let query = getSelectFromQuery(select, tableName, filters);
  query += getFilterIfPresent(FilterType.groupBy, filters, "GROUP BY");
  query += getFilterIfPresent(FilterType.having, filters, "HAVING");
  query += getFilterIfPresent(FilterType.orderBy, filters, "ORDER BY");
  query = query.trim() + ";";

  return query;
}
