export function generateSqlQuery(
  select: { column: string; as?: string }[],
  from: string,
  where: string = "",
  groupBy: string = "",
  having: string = "",
  orderBy: string = ""
) {
  return `
SELECT ${select
    .map((pair) => `${pair.column} AS ${pair.as}`)
    .join(", ")} FROM ${from}
WHERE ${where}
GROUP BY ${groupBy}
HAVING ${having}
ORDER BY ${orderBy};`;
}
