import ApiMiddleware from "../api/ApiMiddleware";
import { secondsToMs } from "../utils/timeConvertion";
import { main } from "../wailsjs/go/models";
import useGlobalContext from "./useGlobalContext";
import useNotifications from "./useNotifications";
import { useQuery } from "@tanstack/react-query";

export default function useTableSchema(
  tableName?: string,
  dependencies: any[] = []
) {
  const notifier = useNotifications();

  const query = useQuery({
    queryKey: ["tableSchema", tableName, ...dependencies],
    queryFn: async () => {
      if (!tableName) return Promise.resolve([] as main.FieldSchema[]);

      try {
        return ApiMiddleware.getTableSchema(tableName);
      } catch (err) {
        notifier.error(err);
        return [] as main.FieldSchema[];
      }
    },
    enabled: !!tableName, // Отключаем запрос, если нет tableName
    staleTime: secondsToMs(30), // Кешируем данные на такое время
    refetchInterval: false, // Не грузить заново
  });

  return { ...query };
}

export function useCurrentTableSchema(dependencies: any[] = []) {
  const { globalContext } = useGlobalContext();
  return useTableSchema(globalContext.currentTable || "", [
    ...dependencies,
    globalContext.currentTable,
  ]);
}