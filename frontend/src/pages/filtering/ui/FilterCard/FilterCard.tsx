import FilterContext from "@/shared/context/FilterContext";
import Icons from "@/shared/ui/components/Icons/Icons";
import clsx from "clsx";
import s from "./style.module.sass";
import { useContext } from "react";
import { Filters, FilterType } from "@/shared/types/filtering";

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
}: {
  filter: string;
  filterType: FilterType;
}) {
  const { filters, setFilters } = useContext(FilterContext);

  return (
    <div className="filter-card">
      <span className="filter-card__query-text">{filter}</span>
      <button
        className={clsx(s["delete-filter-button"])}
        onClick={() => {
          setFilters(removeFilter(filters, filterType, filter));
        }}
      >
        <Icons.Delete />
      </button>
    </div>
  );
}
