import { check } from "express-validator";
import {
  findUserByPhone,
  updateUserById,
} from "../../repository/userRepository";
import { checkUserIfNotExist } from "../../utils/check";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginService = async (phone: string, password: string) => {
  if (phone.startsWith("09")) {
    phone = phone.substring(2);
  }
  const user = await findUserByPhone(phone);
  checkUserIfNotExist(user);

  if (user?.status === "FREEZE") {
    throw createError(
      403,
      "Your account has been frozen. Please contact support.",
      errorCode.ACCOUNT_FROZEN
    );
  }

  const isMatchPassword = await bcrypt.compare(password, user!.password);
  if (!isMatchPassword) {
    const lastRequest = new Date(user!.updatedAt).toLocaleDateString();
    const isSameDay = new Date().toLocaleDateString() === lastRequest;

    if (!isSameDay) {
      await updateUserById(user!.id, { errorLoginCount: 1 });
    } else {
      if (user!.errorLoginCount >= 2) {
        await updateUserById(user!.id, { status: "FREEZE" });
      } else {
        await updateUserById(user!.id, { errorLoginCount: { increment: 1 } });
      }
    }
    throw createError(401, "Incorrect password", errorCode.UNAUTHENTICATED);
  }

  const accessToken = jwt.sign(
    { id: user!.id },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: 60 * 10 } // 10 mins
  );

  const refreshToken = jwt.sign(
    { id: user!.id, phone: user!.phone },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "30d" } // 30 days
  );

  await updateUserById(user!.id, {
    errorLoginCount: 0,
    randToken: refreshToken,
  });

  return { accessToken, refreshToken, userId: user!.id };
};
