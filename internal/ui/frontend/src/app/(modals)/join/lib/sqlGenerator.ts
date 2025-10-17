// app/(modals)/join/lib/sqlGenerator.ts

export function generateSQL(tables: string[]): string {
  if (tables.length === 0) {
    return "SELECT * FROM Product;";
  }

  if (tables.length === 1) {
    return `SELECT * FROM ${tables[0]};`;
  }

  // Простой JOIN по первым двум таблицам (можно расширить)
  const firstTable = tables[0];
  const secondTable = tables[1];

  return `
SELECT *
FROM ${firstTable}
JOIN ${secondTable} ON ${firstTable}.id = ${secondTable}.${firstTable.toLowerCase()}Id;
`.trim();
}
