import moment from "moment";
import bcrypt from "bcrypt";

import { errorCode } from "../../config";
import {
  findOtpByPhone,
  findUserByPhone,
  updateOtpById,
} from "../../repository/userRepository";
import {
  checkOtpErrorIfSameDay,
  checkOtpIfNotExist,
  checkUserIfExist,
} from "../../utils/check";
import { createError } from "../../utils/error";
import { generateToken } from "../../utils/generate";

export const verifyOtpService = async (
  phone: string,
  otp: string,
  token: string,
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
  // If OTP is expired
  const isOtpExpired = moment().diff(otpRow?.updatedAt, "minutes") > 3;
  if (isOtpExpired) {
    throw createError(403, "OTP has expired", errorCode.OTP_EXPIRED);
  }

  // If OTP is wrong
  const isOtpValid = await bcrypt.compare(otp, otpRow!.otp);
  if (!isOtpValid) {
    if (!isSameDay) {
      await updateOtpById(otpRow!.id, {
        errorCount: 1,
      });
    } else {
      await updateOtpById(otpRow!.id, {
        errorCount: { increment: 1 },
      });
    }
    throw createError(400, "Invalid OTP", errorCode.BAD_REQUEST);
  }

  // All are OK
  const verifyToken = generateToken();
  await updateOtpById(otpRow!.id, {
    verifyToken,
    errorCount: 0,
  });

  return verifyToken;
};
