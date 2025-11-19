// src/app/App.tsx
import "@/shared/ui/styles/global.sass";
import { ThemeProvider } from "@gravity-ui/uikit";
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import { Outlet } from "react-router-dom"; // Добавь этот импорт
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
      <ToastContainer />
      <ThemeProvider theme="light">
        <Outlet />
      </ThemeProvider>
    </>
  );
}
