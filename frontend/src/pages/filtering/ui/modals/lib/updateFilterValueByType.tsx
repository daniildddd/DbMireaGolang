import { Filters, FilterType } from "@/pages/filtering/types";

export default function updateFilterValueByType(
  filters: Filters,
  setFilters: (filters: Filters) => void,
  filterType: FilterType,
  filter: string
): void {
  console.log(filters, setFilters);

  const filtersCopy = { ...filters };
  console.log(filtersCopy);
  filtersCopy[filterType].push(filter);
  console.log(filter, filtersCopy);
  setFilters(filtersCopy);
}
