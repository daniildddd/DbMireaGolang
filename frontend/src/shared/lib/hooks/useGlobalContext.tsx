import { GlobalContext } from "@/shared/context/GlobalContext";
import { useContext } from "react";

export default function useGlobalContext() {
  return useContext(GlobalContext);
}
