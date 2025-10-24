import { useEffect, useState } from "react";
import ApiMiddleware from "../api/ApiMiddleware";

export default function useTableNames(): string[] {
  const [tableNames, setTableNames] = useState<string[]>([]);

  useEffect(() => {
    ApiMiddleware.getTableNames()
      .then((response) => setTableNames(response.tableName))
      .catch((err) => console.error(err));
  }, []);

  return tableNames;
}
