import { Filters, FilterType } from "@/shared/types/filtering";

function isFilterTypePresent(filters: Filters, type: FilterType) {
  return filters[type].length > 0;
}

export function generateSqlQuery(
  select: { column: string; as?: string }[] | "*" = "*",
  table: string,
  filters: Filters
) {
  let query =
    select === "*"
      ? "SELECT *"
      : `${select
          .map((pair) => `${pair.column}${pair.as ? ` AS ${pair.as}` : ""}`)
          .join(", ")} `;

  if (isFilterTypePresent(filters, FilterType.aggregate)) {
    query += `, ${filters[FilterType.aggregate].join(", ")}`;
  }

  query += ` FROM ${table}\n`;

  if (isFilterTypePresent(filters, FilterType.where)) {
    query += `\tWHERE ${filters[FilterType.where].join(" AND ")}\n`; // TODO: сделать умнее если нужно
  }
  if (isFilterTypePresent(filters, FilterType.groupBy)) {
    query += `\tGROUP BY ${filters[FilterType.groupBy].join(" AND ")}\n`; // TODO: сделать умнее если нужно
  }
  if (isFilterTypePresent(filters, FilterType.having)) {
    query += `\tHAVING ${filters[FilterType.having].join(" AND ")}\n`; // TODO: сделать умнее если нужно
  }
  if (isFilterTypePresent(filters, FilterType.orderBy)) {
    query += `\tORDER BY ${filters[FilterType.orderBy].join(", ")}`;
  }

  return query.trim() + ";";
}
