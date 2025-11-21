import "@/shared/ui/styles/global.sass";
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import { ThemeProvider } from "@gravity-ui/uikit";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GlobalContext } from "./shared/context/GlobalContext";
import { useState, useEffect } from "react";
import useTableNames from "./shared/lib/hooks/useTableNames";

export default function App() {
  const tableNames = useTableNames();
  const [globalContext, setGlobalContext] = useState<GlobalContext>({
    currentTable: "",
  });

  useEffect(() => {
    if (tableNames.data && tableNames.data.length > 0) {
      setGlobalContext((prev) => ({
        ...prev,
        currentTable: tableNames.data[0],
      }));
    }
  }, [tableNames.data]);

  return (
    <ThemeProvider theme={"light"}>
      <GlobalContext.Provider value={{ globalContext, setGlobalContext }}>
        <ToastContainer />
        <Outlet />
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}
