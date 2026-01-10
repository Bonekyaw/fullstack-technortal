import { redirect } from "react-router";

import useAuthStore from "@/store/authStore";
import { api } from "@/api/axios";

export const loginLoader = async () => {
  try {
    await api.get("/users/auth-check");
    return redirect("/");
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const verifyOtpLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== "otp") {
    return redirect("/register");
  }

  return null;
};

export const confirmPasswordLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== "confirm") {
    return redirect("/register");
  }

  return null;
};
