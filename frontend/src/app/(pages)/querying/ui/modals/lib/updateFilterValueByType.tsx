import { Filters, FilterType } from "@/app/(pages)/types";

export default function updateFilterValueByType(
  filters: Filters,
  setFilters: (filters: Filters) => void,
  filterType: FilterType,
  filter: string
): void {
  const filtersCopy = { ...filters };
  console.log(filtersCopy);
  filtersCopy[filterType].push(filter);
  console.log(filter, filtersCopy);
  setFilters(filtersCopy);
}
