import { useState, useEffect } from "react";
import ApiMiddleware from "../api/ApiMiddleware";
import useGlobalContext from "./useGlobalContext";
import useNotifications from "./useNotifications";
import { main } from "../wailsjs/go/models";

export default function useTableSchema(tableName?: string) {
  const notifier = useNotifications();
  const { globalContext } = useGlobalContext();
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>();

  useEffect(() => {
    ApiMiddleware.getTableSchema(tableName || globalContext.currentTable)
      .then((fields) => {
        setTableSchema(fields);
      })
      .catch((err) => notifier.error(err));
  }, [globalContext]);

  return tableSchema;
}

export function useCurrentTableSchema() {
  const { globalContext } = useGlobalContext();
  return useTableSchema(globalContext.currentTable);
}