import { createBrowserRouter } from "react-router";
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/auth/Login";
import RootLayout from "@/pages/RootLayout";
import Error from "./error";
import RegisterPage from "@/pages/auth/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: Error,
    children: [
      {
        index: true,
        Component: HomePage,
      },
    ],
  },
  { path: "/login", Component: LoginPage },
  { path: "/register", Component: RegisterPage },
]);
