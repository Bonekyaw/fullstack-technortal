import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { errorCode } from "../../config";
import {
  createUser,
  findOtpByPhone,
  findUserByPhone,
  updateOtpById,
  updateUserById,
} from "../../repository/userRepository";
import { checkOtpIfNotExist, checkUserIfExist } from "../../utils/check";
import { createError } from "../../utils/error";
import { generateToken } from "../../utils/generate";

export const confirmPasswordService = async (
  phone: string,
  password: string,
  token: string
) => {
  const user = await findUserByPhone(phone);
  checkUserIfExist(user);

  const otpRow = await findOtpByPhone(phone);
  checkOtpIfNotExist(otpRow);

  if (otpRow!.errorCount >= 5) {
    throw createError(
      400,
      "This request is blocked due to suspicious activity",
      errorCode.ATTACK_DETECTED
    );
  }

  // If token is wrong
  if (otpRow!.verifyToken !== token) {
    await updateOtpById(otpRow!.id, {
      errorCount: 5,
    });
    throw createError(
      400,
      "This request is blocked due to suspicious activity",
      errorCode.ATTACK_DETECTED
    );
  }

  // Request is expired
  const isRequestExpired = moment().diff(otpRow?.updatedAt, "minutes") > 10;
  if (isRequestExpired) {
    throw createError(
      400,
      "This request is expired. Please initiate the process again.",
      errorCode.BAD_REQUEST
    );
  }

  // All are OK - Set password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const randToken = "I will replace this later"; // Placeholder for randToken

  const newUser = await createUser({
    phone,
    password: hashedPassword,
    randToken,
  });

  const accessToken = jwt.sign(
    { id: newUser!.id },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: 60 * 10 } // 10 mins
  );

  const refreshToken = jwt.sign(
    { id: newUser!.id, phone: newUser!.phone },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "30d" } // 30 days
  );

  await updateUserById(newUser!.id, {
    randToken: refreshToken,
  });

  return { accessToken, refreshToken, userId: newUser!.id };
};
