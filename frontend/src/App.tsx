"use client";

import "@/shared/ui/styles/global.sass";

import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import { ThemeProvider } from "@gravity-ui/uikit";

import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <ThemeProvider theme="light">
      <ToastContainer />
      <Outlet />
    </ThemeProvider>
  );
}
