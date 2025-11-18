"use client";

import "@/shared/ui/styles/global.sass";

import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import { ThemeProvider } from "@gravity-ui/uikit";

import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GlobalContext } from "./shared/context/GlobalContext";
import { useState } from "react";

export default function App() {
  const [globalContext, setGlobalContext] = useState<GlobalContext>({
    currentTable: "",
  });

  return (
    <ThemeProvider theme="light">
      <GlobalContext.Provider value={{ globalContext, setGlobalContext }}>
        <ToastContainer />
        <Outlet />
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}
