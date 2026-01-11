import bcrypt from "bcrypt";

import {
  createOtp,
  findOtpByPhone,
  findUserByPhone,
  updateOtpById,
} from "../../repository/userRepository";
import { checkOtpErrorIfSameDay, checkUserIfExist } from "../../utils/check";
import { generateToken } from "../../utils/generate";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";

export const registerService = async (phone: string) => {
  if (phone.startsWith("09")) {
    phone = phone.substring(2);
  }

  const existingUser = await findUserByPhone(phone);
  checkUserIfExist(existingUser);

  // const otp = generateOtp();
  const otp = "123456"; // Placeholder for generated OTP

  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);
  const verificationToken = generateToken();

  const otpRow = await findOtpByPhone(phone);
  let result;
  if (!otpRow) {
    result = await createOtp({
      phone,
      otp: hashedOtp,
      rememberToken: verificationToken,
      count: 1,
    });
  } else {
    const lastRequest = new Date(otpRow.updatedAt).toLocaleDateString();
    const isSameDay = new Date().toLocaleDateString() === lastRequest;
    checkOtpErrorIfSameDay(isSameDay, otpRow.errorCount);

    if (!isSameDay) {
      result = await updateOtpById(otpRow.id, {
        otp: hashedOtp,
        rememberToken: verificationToken,
        count: 1,
        errorCount: 0,
      });
    } else {
      if (otpRow.count >= 3) {
        throw createError(
          429,
          "OTP is allowed 3 times per day. Please try again tomorrow.",
          errorCode.OVER_REQUEST_LIMIT
        );
      } else {
        result = await updateOtpById(otpRow.id, {
          otp: hashedOtp,
          rememberToken: verificationToken,
          count: { increment: 1 },
        });
      }
    }
  }

  // Sending OTP logic would go here (omitted for brevity)
  // If sending fails, throw an error
  // Rollback OTP creation/update if necessary

  return { phone: result.phone, token: result.rememberToken };
};
