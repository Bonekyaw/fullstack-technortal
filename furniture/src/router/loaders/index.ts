import { redirect } from "react-router";

import useAuthStore from "@/store/authStore";
import api from "@/api/axios";
import { productQuery, queryClient } from "@/api/query";

// export const homeLoader = async () => {
//   try {
//     const products = await api.get("users/products?limit=8");
//     const posts = await api.get("users/posts/infinite?limit=3");

//     // const [products, posts] = await Promise.all([
//     //   api.get("users/products?limit=8"),
//     //   api.get("users/posts/infinite?limit=3"),
//     // ]);

//     return { productsData: products.data, postsData: posts.data };
//   } catch (error) {
//     console.log("HomeLoader error:", error);
//   }
// };

export const homeLoader = async () => {
  await queryClient.ensureQueryData(productQuery("?limit=8"));
  return null;
};

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
