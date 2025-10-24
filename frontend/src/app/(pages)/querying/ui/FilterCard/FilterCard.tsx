import { Filters, FilterType } from "@/app/(pages)/types";
import Icons from "@/shared/ui/components/Icons";
import { Card } from "@gravity-ui/uikit";

function removeFilter(
  filters: Filters,
  filterType: FilterType,
  filter: string
): Filters {
  const filtersCopy = { ...filters };
  filtersCopy[filterType] = filtersCopy[filterType].filter((f) => f !== filter);
  return filtersCopy;
}

export default function FilterCard({
  filter,
  filterType,
  filters,
  setFilters,
}: {
  filter: string;
  filterType: FilterType;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) {
  return (
    <Card className="filter-card">
      <span className="filter-card__query-text">{filter}</span>
      <button
        className="filter-card__delete-button button"
        onClick={() => setFilters(removeFilter(filters, filterType, filter))}
      >
        <Icons.Delete />
      </button>
    </Card>
  );
}
