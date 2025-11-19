import { createContext, Dispatch, SetStateAction } from "react";
import { EMPTY_FILTERS } from "@/shared/const";
import { Filters } from "@/shared/types/filtering";

interface FilterContextType {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

const FilterContext = createContext<FilterContextType>({
  filters: EMPTY_FILTERS,
} as FilterContextType);
export default FilterContext;
