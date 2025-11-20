import ApiMiddleware from "../api/ApiMiddleware";
import { useQuery } from "@tanstack/react-query";
import useNotifications from "./useNotifications";

export default function useTableNames(dependencies: any[] = []) {
  const notifier = useNotifications();

  const { isPending, error, data } = useQuery({
    queryKey: ["tableNames", ...dependencies],
    queryFn: () =>
      ApiMiddleware.getTableNames()
        .then((response) => response.tableName)
        .catch((err) => {
          notifier.error(err);
          return [] as string[];
        }),
  });

  return { isPending, error, data };
}
