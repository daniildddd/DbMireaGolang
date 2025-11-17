import { Dispatch, SetStateAction, createContext } from "react";

interface CurrentTableContextType {
  currentTable: string;
  setCurrentTable: Dispatch<SetStateAction<string>>;
}

export const TableContext = createContext<CurrentTableContextType>(
  {} as CurrentTableContextType
);
