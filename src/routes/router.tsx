import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/layouts/RootLayout";
import PrivateLayout from "../components/layouts/PrivateLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import User from "../pages/Users";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "admin",
        element: <PrivateLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "users",
            element: <User />,
          },
        ],
      },
    ],
  },
]);
