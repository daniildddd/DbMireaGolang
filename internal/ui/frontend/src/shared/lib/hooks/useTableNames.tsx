import { useEffect, useState } from "react";

export default function useTableNames() {
  const [tableNames, setTableNames] = useState<string[]>([]);
  // Initial parse of table names
  useEffect(() => {
    const mock = ["name1", "name2", "name3"];
    setTableNames(mock);
  }, []);

  return tableNames;
}
