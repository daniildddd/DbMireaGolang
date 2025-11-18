import { RouterProvider } from "react-router-dom";
import React from "react";
import { router } from "./router";
import { createRoot } from "react-dom/client";

import "@/shared/ui/styles/global.sass";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
