import { Filters, FilterType } from "@/pages/filtering/types";

export function generateSqlQuery(
  select: { column: string; as?: string }[] | "*" = "*",
  table: string,
  filters?: Filters,
  oneLine: boolean = false
) {
  let query =
    select === "*"
      ? "SELECT *"
      : `${select
          .map((pair) => `${pair.column}${pair.as ? ` AS ${pair.as}` : ""}`)
          .join(", ")} `;

  if (filters[FilterType.aggregate].length) {
    query += `, ${filters[FilterType.aggregate].join(", ")}`;
  }

  query += ` FROM ${table}\n\t`;

  if (filters) {
    if (filters[FilterType.where].length) {
      query += `WHERE ${filters[FilterType.where].join(" AND ")}\n\t`; // TODO: сделать умнее если нужно
    }
    if (filters[FilterType.groupBy].length) {
      query += `GROUP BY ${filters[FilterType.groupBy].join(" AND ")}\n\t`; // TODO: сделать умнее если нужно
    }
    if (filters[FilterType.having].length) {
      query += `HAVING ${filters[FilterType.having].join(" AND ")}\n\t`; // TODO: сделать умнее если нужно
    }
    if (filters[FilterType.orderBy].length) {
      query += `ORDER BY ${filters[FilterType.orderBy].join(", ")}`;
    }
  }

  return query.trim() + ";";
}
