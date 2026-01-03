import { redirect } from "react-router";

import useAuthStore from "@/store/authStore";

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
