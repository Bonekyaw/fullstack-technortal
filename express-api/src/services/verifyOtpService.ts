import { errorCode } from "../config";
import {
  findOtpByPhone,
  findUserByPhone,
  updateOtpById,
} from "../repository/userRepository";
import {
  checkOtpErrorIfSameDay,
  checkOtpIfNotExist,
  checkUserIfExist,
} from "../utils/check";
import { createError } from "../utils/error";

export const verifyOtpService = async (
  phone: string,
  otp: string,
  token: string
) => {
  const user = await findUserByPhone(phone);
  checkUserIfExist(user);

  const otpRow = await findOtpByPhone(phone);
  checkOtpIfNotExist(otpRow);

  const lastRequest = new Date(otpRow!.updatedAt).toLocaleDateString();
  const isSameDay = new Date().toLocaleDateString() === lastRequest;
  checkOtpErrorIfSameDay(isSameDay, otpRow!.errorCount);

  // If Token is wrong
  if (otpRow!.rememberToken !== token) {
    await updateOtpById(otpRow!.id, {
      errorCount: 5,
    });

    throw createError(400, "Invalid token", errorCode.BAD_REQUEST);
  }

  // If OTP is wrong
};
