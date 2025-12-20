import prisma from "../lib/prisma";

export const findUserByPhone = async (phone: string) => {
  return await prisma.user.findUnique({
    where: { phone },
  });
};

export const updateUserById = async (id: number, data: any) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};
