import { errorCode } from "../../config";
import { cacheQueue } from "../../jobs/queues/cacheQueue";
import ImageQueue from "../../jobs/queues/imageQueue";
import { createProduct } from "../../repository/productRepository";
import { createError } from "../../utils/error";

type ProductProps = {
  name: string;
  description: string;
  price: number;
  discount: number;
  inventory: number;
  category: string;
  type: string;
  files: any;
};
export const productCreateService = async (product: ProductProps) => {
  const {
    name,
    description,
    price,
    discount,
    inventory,
    category,
    type,
    files,
  } = product;

  await Promise.all(
    files.map(async (file: any) => {
      // console.log("Uploaded file:", file.filename);
      const splitFileName = file.filename.split(".")[0];
      return ImageQueue.add(
        "optimize-image",
        {
          filePath: file.path,
          fileName: `${splitFileName}.webp`,
          width: 835,
          height: 577,
          quality: 100,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        },
      );
    }),
  );

  const originalFileNames = files.map((file: any) => ({
    url: file.filename,
  }));

  const data: any = {
    name,
    description,
    price,
    discount,
    inventory: +inventory,
    category,
    type,
    images: originalFileNames,
  };
  let newProduct;
  try {
    newProduct = await createProduct(data);
  } catch (error) {
    throw createError(500, "Cannot create a new post.", errorCode.SERVER_ERROR);
  }

  await cacheQueue.add(
    "invalidate-product-cache",
    {
      pattern: "products:*",
    },
    {
      jobId: `invalidate-${Date.now()}`,
      priority: 1,
    },
  );

  return newProduct.id;
};
