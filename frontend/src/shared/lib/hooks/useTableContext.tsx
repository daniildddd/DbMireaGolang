import { TableContext } from "@/shared/context/TableContext";
import { useContext } from "react";

export function useTableContext() {
  return useContext(TableContext);
}
