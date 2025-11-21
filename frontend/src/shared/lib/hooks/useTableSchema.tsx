import ApiMiddleware from "../api/ApiMiddleware";
import { main } from "../wailsjs/go/models";
import useGlobalContext from "./useGlobalContext";
import useNotifications from "./useNotifications";
import { useQuery } from "@tanstack/react-query";

export default function useTableSchema(
  tableName: string,
  dependencies: any[] = []
) {
  const notifier = useNotifications();

  // Если tableName пуст, не отправляем запрос
  const { isPending, error, data } = useQuery({
    queryKey: ["tableSchema", tableName, ...dependencies],
    queryFn: () =>
      ApiMiddleware.getTableSchema(tableName)
        .then((fields) => fields)
        .catch((err) => {
          notifier.error(err);
          return [] as main.FieldSchema[];
        }),
    enabled: !!tableName, // Отключаем запрос если tableName пуст
  });

  return { isPending, error, data };
}

export function useCurrentTableSchema(dependencies: any[] = []) {
  const { globalContext } = useGlobalContext();

  // Если currentTable не установлена, не отправляем запрос
  if (!globalContext.currentTable) {
    return {
      isPending: false,
      error: null,
      data: [] as main.FieldSchema[],
    };
  }

  return useTableSchema(globalContext.currentTable, [
    ...dependencies,
    globalContext.currentTable,
  ]);
}
