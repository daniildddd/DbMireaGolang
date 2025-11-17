import { Filters, FilterType } from "@/pages/filtering/types";

/**
 * @param {Filters} filters - состояние фильтров
 * @param {Dispatch<SetStateAction<Filters>>} setFilters - сеттер фильтров
 * @param {FilterType} filterType - к какому виду фильтров относится
 * @param {string} filter - текстовое представление фильтра
 */
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
