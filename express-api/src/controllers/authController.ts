import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../utils/error";
import { errorCode } from "../config";
import { loginService } from "../services/loginService";

export const login = [
  body("phone", "Invalid Phone Number")
    .trim()
    .matches(/^\d+$/)
    .isLength({ min: 5, max: 12 }),
  body("password", "Password must be 8 digits long")
    .trim()
    .matches(/^\d+$/)
    .isLength({ min: 8, max: 8 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(400, errors[0]?.msg, errorCode.VALIDATION_ERROR));
    }

    try {
      const { phone, password } = req.body;
      const { accessToken, refreshToken, userId } = await loginService(
        phone,
        password
      );
      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // https only in production
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 10 * 60 * 1000, // 10 minutes,
          path: "/",
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // https only in production
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days,
          path: "/",
        })
        .status(200)
        .json({ message: "Login successful", userId });
    } catch (error) {
      next(error);
    }
  },
];
