import { useQuery } from "@tanstack/react-query";
import ApiMiddleware from "../middleware/ApiMiddleware";
import useNotifications from "./useNotifications";
import { Filters } from "../types/filtering";

function flattenFilters(filters: Filters): string[] {
  return Object.values(filters).reduce((acc, next) => acc.concat(next), []);
}

export default function useTableDataByFilters(
  query: string,
  tableName: string,
  dependencies: any[] = []
) {
  const notifier = useNotifications();

  const { isPending, error, data } = useQuery({
    queryKey: ["tableNames", ...dependencies],
    queryFn: () =>
      ApiMiddleware.getDataByCustomQuery({ query })
        .then((response) => {
          if (response.error) throw response.error;
          else return response;
        })
        .catch((err) => {
          notifier.error(err);
          return [] as string[];
        }),
  });

  return { isPending, error, data };
}
