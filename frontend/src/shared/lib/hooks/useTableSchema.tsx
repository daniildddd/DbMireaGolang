import ApiMiddleware from "../api/ApiMiddleware";
import { main } from "../wailsjs/go/models";
import useGlobalContext from "./useGlobalContext";
import useNotifications from "./useNotifications";
import { useQuery } from "@tanstack/react-query";

// useTableSchema.ts
export default function useTableSchema(tableName?: string, dependencies: any[] = []) {
  const notifier = useNotifications();
  const { globalContext } = useGlobalContext();

  const { isPending, error, data } = useQuery({
    queryKey: ["tableSchema", tableName, ...dependencies],
    queryFn: () => {
      if (!tableName) return Promise.resolve([] as main.FieldSchema[]);

      return ApiMiddleware.getTableSchema(tableName)
        .then((fields) => fields)
        .catch((err) => {
          notifier.error(err);
          return [] as main.FieldSchema[];
        });
    },
    enabled: !!tableName, // Отключаем запрос, если нет tableName
  });

  return { isPending, error, data };
}

export function useCurrentTableSchema(dependencies: any[] = []) {
  const { globalContext } = useGlobalContext();
  return useTableSchema(globalContext.currentTable || "", [
    ...dependencies,
    globalContext.currentTable,
  ]);
}