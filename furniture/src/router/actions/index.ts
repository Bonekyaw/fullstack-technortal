import { authAPi } from "@/api/axios";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";

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
