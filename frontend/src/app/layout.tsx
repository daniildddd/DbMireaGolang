import "@shared/ui/styles/globals.sass";

// @gravity-ui/uikit
import { ThemeProvider } from "@gravity-ui/uikit";
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";

import { ToastContainer } from "react-toastify";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <ThemeProvider theme="light">{children}</ThemeProvider>
      </body>
    </html>
  );
}
