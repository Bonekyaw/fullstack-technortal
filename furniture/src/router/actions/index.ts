import { authAPi } from "@/api/axios";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import useAuthStore from "@/store/authStore";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  // const phone = formData.get("phone");
  // const password = formData.get("password");
  const data = Object.fromEntries(formData);

  try {
    await authAPi.post("/login", data);
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: `Login failed: ${error.response.data.message}` };
      }
    }
  }
};

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await authAPi.post("/register", data);
    authStore.setAuth(response.data.phone, response.data.token, "otp");
    return redirect("/register/otp");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: `Registration failed: ${error.response.data.message}` };
      }
    }
  }
};

export const verifyOtpAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  // const data = Object.fromEntries(formData);

  const data = {
    phone: authStore.phone,
    otp: formData.get("pin"),
    token: authStore.token,
  };

  try {
    const response = await authAPi.post("/verify-otp", data);
    authStore.setAuth(response.data.phone, response.data.token, "confirm");
    return redirect("/register/confirm-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          error: `OTP verification failed: ${error.response.data.message}`,
        };
      }
    }
  }
};

export const confirmPasswordAction = async ({
  request,
}: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  // const data = Object.fromEntries(formData);

  const data = {
    phone: authStore.phone,
    password: formData.get("password"),
    token: authStore.token,
  };

  try {
    await authAPi.post("/confirm-password", data);
    authStore.clearAuth();
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          error: `Password Confirmation failed: ${error.response.data.message}`,
        };
      }
    }
  }
};
