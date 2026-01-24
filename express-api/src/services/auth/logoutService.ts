import { findUserById, updateUserById } from "../../repository/userRepository";
import { checkUserIfNotExist } from "../../utils/check";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/generate";

export const logoutService = async (refreshToken: string) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      id: number;
      phone: string;
    };
  } catch (err) {
    throw createError(
      401,
      "You are not an authenticated user!.",
      errorCode.UNAUTHENTICATED,
    );
  }

  if (isNaN(decoded.id)) {
    throw createError(
      401,
      "You are not an authenticated user!.",
      errorCode.UNAUTHENTICATED,
    );
  }

  if (isNaN(decoded.id)) {
    throw createError(
      401,
      "You are not an authenticated user!.",
      errorCode.UNAUTHENTICATED,
    );
  }

  const user = await findUserById(decoded.id);
  checkUserIfNotExist(user);

  if (user!.phone !== decoded.phone) {
    throw createError(
      401,
      "You are not an authenticated user!.",
      errorCode.UNAUTHENTICATED,
    );
  }

  const userData = {
    randToken: generateToken(),
  };
  await updateUserById(user!.id, userData);

  return true;
};
