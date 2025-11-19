import { Filters, FilterType } from "@/shared/types/filtering";
import { Dispatch, SetStateAction } from "react";

export default function updateFilterValueByType(
  filters: Filters,
  setFilters: Dispatch<SetStateAction<Filters>>,
  filterType: FilterType,
  filter: string
): void {
  const filtersCopy = { ...filters };
  filtersCopy[filterType].push(filter);
  setFilters(filtersCopy);
}
