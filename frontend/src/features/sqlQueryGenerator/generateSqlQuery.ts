import { Filters, FilterType } from "@/shared/types/filtering";

type SelectPair = { column: string; as?: string };
type Select = SelectPair[] | "*";

function isFilterTypePresent(filters: Filters, type: FilterType): boolean {
  return filters[type].length > 0;
}

function getSelectFromQuery(
  select: Select = "*",
  tableName: string,
  filters: Filters
): string {
  let query =
    select === "*"
      ? "SELECT *"
      : `${select.map((pair) => `${pair.column}${pair?.as}`).join(", ")} `;

  if (isFilterTypePresent(filters, FilterType.aggregate)) {
    query += `\tWHERE ${filters[FilterType.aggregate].join(" AND ")}\n`; // TODO: сделать умнее если нужно
  }

  if (isFilterTypePresent(filters, FilterType.nullHandlingRule)) {
    query += `\tWHERE ${filters[FilterType.nullHandlingRule].join(" AND ")}\n`;
  }

  query += ` FROM ${tableName}\n`;
  return query;
}

function getWhereQuery(filters: Filters): string {
  if (isFilterTypePresent(filters, FilterType.where)) {
    return `\tWHERE ${filters[FilterType.where].join(" AND ")}\n`; // TODO: сделать умнее если нужно
  } else {
    return "";
  }
}

function getGroupByQuery(filters: Filters): string {
  if (isFilterTypePresent(filters, FilterType.groupBy)) {
    return `\tGROUP BY ${filters[FilterType.groupBy].join(" AND ")}\n`; // TODO: сделать умнее если нужно
  } else {
    return "";
  }
}

function getHavingQuery(filters: Filters): string {
  if (isFilterTypePresent(filters, FilterType.having)) {
    return `\tHAVING ${filters[FilterType.having].join(" AND ")}\n`; // TODO: сделать умнее если нужно
  } else {
    return "";
  }
}

function getOrderByQuery(filters: Filters): string {
  if (isFilterTypePresent(filters, FilterType.orderBy)) {
    return `\tORDER BY ${filters[FilterType.orderBy].join(", ")}`;
  } else {
    return "";
  }
}

export function generateSqlQuery(
  select: Select = "*",
  tableName: string,
  filters: Filters
) {
  let query = getSelectFromQuery(select, tableName, filters);
  query += getWhereQuery(filters);
  query += getGroupByQuery(filters);
  query += getHavingQuery(filters);
  query += getOrderByQuery(filters);
  query = query.trim() + ";";

  return query;
}
