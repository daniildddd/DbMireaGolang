import { useState } from "react";
import ApiMiddleware from "../api/ApiMiddleware";

export default function useTableNames() {
  const [tableNames, setTableNames] = useState<string[]>(
    ApiMiddleware.getTableNames()
  );
  return tableNames;
}
