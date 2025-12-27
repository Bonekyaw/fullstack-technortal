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

export const findOtpByPhone = async (phone: string) => {
  return await prisma.otp.findUnique({
    where: { phone },
  });
};

export const createOtp = async (data: any) => {
  return await prisma.otp.create({
    data,
  });
};

export const updateOtpById = async (id: number, data: any) => {
  return await prisma.otp.update({
    where: { id },
    data,
  });
};
