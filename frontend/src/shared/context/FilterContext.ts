import { createContext, Dispatch, SetStateAction } from "react";
import { Filters } from "../../pages/filtering/types";

const FilterContext = createContext<{
  filters: Filters;
  setFilters?: Dispatch<SetStateAction<Filters>>;
}>({
  filters: {} as Filters,
});
export default FilterContext;
