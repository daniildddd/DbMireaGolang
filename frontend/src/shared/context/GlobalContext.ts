import { Dispatch, SetStateAction, createContext } from "react";

export interface GlobalContext {
  currentTable: string;
}

interface IGlobalContext {
  globalContext: GlobalContext;
  setGlobalContext: Dispatch<SetStateAction<GlobalContext>>;
}

export const GlobalContext = createContext<IGlobalContext>(
  {} as IGlobalContext
);
