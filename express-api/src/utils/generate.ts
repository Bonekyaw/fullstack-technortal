import { randomBytes } from "crypto";

export const generateOtp = () => {
  // generate a 6-digit OTP
  return (parseInt(randomBytes(3).toString("hex"), 16) % 900000) + 100000;
};

export const generateToken = () => {
  // generate a random token string
  return randomBytes(32).toString("hex");
};
