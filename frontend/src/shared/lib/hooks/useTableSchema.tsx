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

  const { isPending, error, data } = useQuery({
    queryKey: ["tableSchema", ...dependencies],
    queryFn: () =>
      ApiMiddleware.getTableSchema(tableName)
        .then((fields) => fields)
        .catch((err) => {
          notifier.error(err);
          return [] as main.FieldSchema[];
        }),
  });

  return { isPending, error, data };
}

export function useCurrentTableSchema(dependencies: any[] = []) {
  const { globalContext } = useGlobalContext();
  return useTableSchema(globalContext.currentTable, [
    ...dependencies,
    globalContext.currentTable,
  ]);
}
