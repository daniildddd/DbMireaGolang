import { Filters, FilterType } from "@/shared/types/filtering";

type SelectPair = { column: string; as?: string };
type Select = SelectPair[] | "*";

function isFilterTypePresent(filters: Filters, type: FilterType): boolean {
  return filters[type] ? filters[type].length > 0 : false;
}

/**
 * @param {FilterType} filterType - тип фильтра, по которому производится соединение параметров
 * @param {Filters} filters - фильтры
 * @returns {string} комбинация из фильтров, если такой фильтр существует
 */
export function chainFilterParams(
  filterType: FilterType,
  filters: Filters,
  operatorPrepend: string = ""
): string {
  if (isFilterTypePresent(filters, filterType)) {
    let chain = `${filters[filterType].join(" AND ")}`;
    if (operatorPrepend) {
      chain = operatorPrepend.toLocaleUpperCase() + " " + chain;
    }
    return chain;
  } else {
    return "";
  }
}

export function getSelectQuery(select: Select = "*"): string {
  return select === "*" || !select.length
    ? "SELECT *"
    : `SELECT ${select
        .map((pair) => `${pair.column}${pair.as ? " AS " + pair.as : ""}`)
        .join(", ")}`;
}

function tab(s: string) {
  return s !== "" ? `\t` + s : "";
}

export function generateSqlQuery(
  select: Select = "*",
  tableName: string,
  filters: Filters
) {
  const where = [
    chainFilterParams(FilterType.where, filters, "WHERE"),
    chainFilterParams(FilterType.caseQuery, filters),
    chainFilterParams(FilterType.nullHandlingRule, filters),
    chainFilterParams(FilterType.regex, filters),
    chainFilterParams(FilterType.subquery, filters),
    chainFilterParams(FilterType.aggregate, filters),
    chainFilterParams(FilterType.groupBy, filters, "GROUP BY"),
    chainFilterParams(FilterType.having, filters, "HAVING"),
    chainFilterParams(FilterType.orderBy, filters, "ORDER BY"),
  ]
    .filter((query) => query.length > 0)
    .join("\n")
    .trim();

  let query = `
${getSelectQuery(select)} FROM ${tableName}
${where}
`;

  return query.trim() + ";";
}
