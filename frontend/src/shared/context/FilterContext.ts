import { createContext, Dispatch, SetStateAction } from "react";
import { Filters } from "../../pages/filtering/types";

interface FilterContextType {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

const FilterContext = createContext<FilterContextType>({} as FilterContextType);
export default FilterContext;
