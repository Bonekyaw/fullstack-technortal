import { check } from "express-validator";
import { findUserByPhone } from "../repository/userRepository";
import { checkUserIfNotExist } from "../utils/check";
import { createError } from "../utils/error";
import { errorCode } from "../config";
import * as bcrypt from "bcrypt";

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
};
