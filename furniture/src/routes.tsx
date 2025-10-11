import { createBrowserRouter } from "react-router";
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/auth/Login";
import RootLayout from "@/pages/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
    ],
  },
  { path: "/login", Component: LoginPage },
]);
