import { Filters, FilterType } from "@/shared/types/filtering";

export default function updateFilterValueByType(
  filters: Filters,
  setFilters: (filters: Filters) => void,
  filterType: FilterType,
  filter: string
): void {
  const filtersCopy = { ...filters };
  filtersCopy[filterType].push(filter);
  setFilters(filtersCopy);
}
