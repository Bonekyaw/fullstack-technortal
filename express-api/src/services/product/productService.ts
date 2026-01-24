import { getProductsList } from "../../repository/productRepository";
import { getOrSetCache } from "../../utils/cache";

type GetProductProps = {
  lastCursor?: number | null | undefined;
  limit: number;
  category?: string | undefined; // Explicitly allow undefined
  type?: string | undefined; // Explicitly allow undefined
  query: any;
};

export const getProductsService = async (params: GetProductProps) => {
  const { lastCursor, limit, category, type, query } = params;

  let categoryList: number[] = [];
  let typeList: number[] = [];

  if (category) {
    categoryList = category
      .split(",")
      .map((c) => Number(c))
      .filter((c) => c > 0);
  }

  if (type) {
    typeList = type
      .split(",")
      .map((t) => Number(t))
      .filter((t) => t > 0);
  }

  // console.log("categoryList -----", categoryList);

  const where = {
    AND: [
      categoryList.length > 0 ? { categoryId: { in: categoryList } } : {}, // [1,2,3]
      typeList.length > 0 ? { typeId: { in: typeList } } : {},
    ],
  };

  const options = {
    where,
    take: limit + 1,
    skip: lastCursor ? 1 : 0,
    cursor: lastCursor ? { id: lastCursor } : undefined,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      discount: true,
      status: true,
      images: {
        select: {
          id: true,
          url: true,
        },
        take: 1, // Limit to the first image
      },
    },
    orderBy: {
      id: "desc",
    },
  };

  const cacheKey = `products:${JSON.stringify(query)}`; // "products:{"limit":5,"category":"1,2","type":"3"}"
  const products = await getOrSetCache(cacheKey, async () => {
    return await getProductsList(options);
  });

  const hasNextPage = products.length > +limit;

  if (hasNextPage) {
    products.pop();
  }

  const nextCursor =
    products.length > 0 ? products[products.length - 1].id : null;

  return { hasNextPage, nextCursor, prevCursor: lastCursor, products };
};
