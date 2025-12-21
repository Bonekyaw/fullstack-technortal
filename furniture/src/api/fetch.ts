export const fetchApi = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${endpoint}`,
      options
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return response.json();
  } catch (error) {
    console.log(error);
  }
};
