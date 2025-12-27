import { errorCode } from "../config";
import { createError } from "./error";

export const checkUserIfNotExist = (user: any) => {
  if (!user) {
    throw createError(
      401,
      "This phone number has not registered",
      errorCode.UNAUTHENTICATED
    );
  }
};

export const checkUserIfExist = (user: any) => {
  if (user) {
    throw createError(
      409,
      "This phone number has already registered",
      errorCode.USER_ALREADY_EXISTS
    );
  }
};

export const checkOtpErrorIfSameDay = (
  isSameDay: boolean,
  errorCount: number
) => {
  if (isSameDay && errorCount >= 5) {
    throw createError(
      429,
      "OTP is wrong 5 times today. Please try again tomorrow.",
      errorCode.OVER_REQUEST_LIMIT
    );
  }
};

export const checkOtpIfNotExist = (otpRow: any) => {
  if (!otpRow) {
    throw createError(
      400,
      "This phone number is incorrect.",
      errorCode.BAD_REQUEST
    );
  }
};
