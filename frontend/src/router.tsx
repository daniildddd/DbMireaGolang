import { createBrowserRouter } from "react-router-dom";
import DatabaseStructurePage from "./pages/database-structure/page";
import FilteringPage from "./pages/filtering/page";
import HomePage from "./pages/home-page/HomePage";
import JoinPage from "./pages/join/page";
import CustomTypesPage from "./pages/custom-types/page";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/database-structure", element: <DatabaseStructurePage /> },
      { path: "/join", element: <JoinPage /> },
      { path: "/filtering", element: <FilteringPage /> },
      { path: "/custom-types", element: <CustomTypesPage /> },
    ],
  },
]);
