import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { createError } from "../utils/error";
import { errorCode } from "../config";
import { findUserById, updateUserById } from "../repository/userRepository";

interface CustomRequest extends Request {
  userId?: number;
}

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);

  if (!refreshToken) {
    return next(
      createError(
        401,
        "You are not an authenticated user. 1",
        errorCode.UNAUTHENTICATED
      )
    );
  }

  const generateNewTokens = async () => {
    let decode;
    try {
      decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        phone: string;
      };
    } catch {
      return next(
        createError(
          401,
          "You are not an authenticated user. 2",
          errorCode.UNAUTHENTICATED
        )
      );
    }

    if (isNaN(decode.id)) {
      return next(
        createError(
          401,
          "You are not an authenticated user. 3",
          errorCode.UNAUTHENTICATED
        )
      );
    }

    const user = await findUserById(decode.id);
    if (!user) {
      return next(
        createError(
          401,
          "This account has not registered yet. 4",
          errorCode.UNAUTHENTICATED
        )
      );
    }

    if (user.phone !== decode.phone) {
      return next(
        createError(
          401,
          "You are not an authenticated user. 5",
          errorCode.UNAUTHENTICATED
        )
      );
    }

    if (user.randToken !== refreshToken) {
      return next(
        createError(
          401,
          "You are not an authenticated user. 7",
          errorCode.UNAUTHENTICATED
        )
      );
    }

    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 60 * 10 } // 10 mins
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "30d" } // 30 days
    );

    await updateUserById(user.id, { randToken: newRefreshToken });

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // https only in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 10 * 60 * 1000, // 10 minutes,
        path: "/",
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // https only in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days,
        path: "/",
      });

    req.userId = user.id;
    next();
  };

  if (!accessToken) {
    generateNewTokens();
  } else {
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        id: number;
      };
      if (isNaN(decoded.id)) {
        return next(
          createError(
            401,
            "You are not an authenticated user. 8",
            errorCode.UNAUTHENTICATED
          )
        );
      }

      req.userId = decoded.id;
      next();
    } catch (error: any) {
      //   generateNewTokens();
      if (error.name === "TokenExpiredError") {
        generateNewTokens();
      } else {
        return next(
          createError(
            401,
            "You are not an authenticated user. 9",
            errorCode.UNAUTHENTICATED
          )
        );
      }
    }
  }
};
