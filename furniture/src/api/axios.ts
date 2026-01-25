import axios from "axios";

export const authAPi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized error (e.g., redirect to login)
        window.location.href = "/login";
      }

      if (error.response.status === 429) {
        // Rate limit hit - wait and retry once
        const retryAfter = error.response.headers["retry-after"];
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 2000;

        console.warn(`Rate limited. Retrying after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Retry the request once
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
