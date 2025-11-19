import { useState, useEffect } from "react";
import ApiMiddleware from "../api/ApiMiddleware";
import useGlobalContext from "./useGlobalContext";
import useNotifications from "./useNotifications";
import { main } from "../wailsjs/go/models";

export default function useTableSchema(tableName?: string) {
  const notifier = useNotifications();
  const { globalContext } = useGlobalContext();
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tableName && !globalContext.currentTable) return;

    const currentTable = tableName || globalContext.currentTable;
    setIsLoading(true);

    ApiMiddleware.getTableSchema(currentTable)
      .then((fields) => {
        setTableSchema(fields);
      })
      .catch((err) => notifier.error(err))
      .finally(() => setIsLoading(false));
  }, [globalContext.currentTable, tableName]); // ✅ Зависимость от обоих

  return {
    tableSchema,
    isLoading,
    refetch: () => {
      // Функция для принудительного обновления
      if (tableName || globalContext.currentTable) {
        ApiMiddleware.getTableSchema(tableName || globalContext.currentTable)
          .then(setTableSchema)
          .catch(notifier.error);
      }
    },
  };
}

export function useCurrentTableSchema() {
  const { globalContext } = useGlobalContext();
  return useTableSchema(globalContext.currentTable);
}
