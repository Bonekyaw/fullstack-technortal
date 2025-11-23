import prisma from "../lib/prisma";

export const findUserByPhone = async (phone: string) => {
  return await prisma.user.findUnique({
    where: { phone },
  });
};
