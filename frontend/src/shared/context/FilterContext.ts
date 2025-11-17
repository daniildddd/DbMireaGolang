import { createContext, Dispatch, SetStateAction } from "react";
import { Filters, FilterType } from "../../pages/filtering/types";

const FilterContext = createContext<{
  filters: Filters;
  setFilters?: Dispatch<SetStateAction<Filters>>;
}>({
  filters: {
    [FilterType.where]: [],
    [FilterType.aggregate]: [],
    [FilterType.having]: [],
    [FilterType.orderBy]: [],
    [FilterType.groupBy]: [],
  },
});
export default FilterContext;
