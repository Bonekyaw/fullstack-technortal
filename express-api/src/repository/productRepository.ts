import prisma from "../lib/prisma";

export const createProduct = async (data: any) => {
  const productdata: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    inventory: data.inventory,
    category: {
      connectOrCreate: {
        where: { name: data.category },
        create: {
          name: data.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: data.type },
        create: {
          name: data.type,
        },
      },
    },
    images: {
      create: data.images,
    },
  };

  return prisma.product.create({ data: productdata });
};

export const getProductsList = async (options: any) => {
  return prisma.product.findMany(options);
};

export const getCategoryList = async () => {
  return prisma.category.findMany();
};

export const getTypeList = async () => {
  return prisma.type.findMany();
};
