import { createBrowserRouter } from "react-router";
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/auth/Login";
import RootLayout from "@/pages/RootLayout";
import Error from "./error";
import RegisterPage from "@/pages/auth/Register";
import AuthLayout from "@/pages/auth/AuthLayout";
import OtpPage from "@/pages/auth/Otp";
import ConfirmPasswordPage from "@/pages/auth/ConfirmPassword";
import { loginAction } from "@/router/actions";

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
  { path: "/login", Component: LoginPage, action: loginAction },
  {
    path: "/register",
    Component: AuthLayout,
    children: [
      { index: true, Component: RegisterPage },
      { path: "otp", Component: OtpPage },
      { path: "confirm-password", Component: ConfirmPasswordPage },
    ],
  },
]);

// /register
// /register/otp
// register/confirm-password
