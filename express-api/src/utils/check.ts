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
