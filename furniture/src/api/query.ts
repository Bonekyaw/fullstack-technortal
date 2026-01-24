import { QueryClient, keepPreviousData } from "@tanstack/react-query";
import api from "./axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      // retry: 2,
    },
  },
});

const fetchProducts = (q?: string) =>
  api.get(`/products${q ?? ""}`).then((res) => res.data);

export const productQuery = (q?: string) => ({
  queryKey: ["products", q],
  queryFn: () => fetchProducts(q),
});

const fetchCategoryType = async () =>
  api.get("/filter-type").then((res) => res.data);

export const categoryTypeQuery = () => ({
  queryKey: ["category", "type"],
  queryFn: fetchCategoryType,
});

const fetchInfiniteProducts = async ({
  pageParam = null,
  categories = null,
  types = null,
}: {
  pageParam?: number | null;
  categories?: string | null;
  types?: string | null;
}) => {
  let query = pageParam ? `?limit=9&cursor=${pageParam}` : "?limit=9";
  if (categories) query += `&category=${categories}`;
  if (types) query += `&type=${types}`;
  const response = await api.get(`/products${query}`);
  return response.data;
};

export const productInfiniteQuery = (
  categories: string | null = null,
  types: string | null = null,
) => ({
  queryKey: [
    "products",
    "infinite",
    categories ?? undefined,
    types ?? undefined,
  ],
  queryFn: ({ pageParam }: { pageParam?: number | null }) =>
    fetchInfiniteProducts({ pageParam, categories, types }),
  placeholderData: keepPreviousData,
  initialPageParam: null, // Start with no cursor
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
  // getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor ?? undefined,
  // maxPages: 7,
});

const fetchOneProduct = async (id: number) => {
  const product = await api.get(`/products/${id}`);
  if (!product) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return product.data;
};

export const oneProductQuery = (id: number) => ({
  queryKey: ["products", "detail", id],
  queryFn: () => fetchOneProduct(id),
});
