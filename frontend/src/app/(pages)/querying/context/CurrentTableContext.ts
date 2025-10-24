import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import { createContext } from "react";

export const CurrentTableContext = createContext<string>("");
