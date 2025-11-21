import { Filters, FilterType } from "@/shared/types/filtering";
import { Dispatch, SetStateAction } from "react";

export default function updateFilterValueByType(
  filters: Filters,
  setFilters: Dispatch<SetStateAction<Filters>>,
  filterType: FilterType,
  filter: string
): void | Error {
  const filtersCopy = { ...filters };
  if (filtersCopy[filterType].includes(filter)) {
    return Error("Фильтр уже существует");
  }
  filtersCopy[filterType].push(filter);
  setFilters(filtersCopy);
}
