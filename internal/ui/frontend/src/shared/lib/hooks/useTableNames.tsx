import { useState } from "react";

export default function useTableNames() {
  const [tableNames, setTableNames] = useState<string[]>([
    "Product",
    "ProductionBatch",
    "Inventory",
    "Sale",
  ]);
  return tableNames;
}
