import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";
import { removeFiles } from "../../utils/removeFile";
import { findUserById } from "../../repository/userRepository";

interface CustomRequest extends Request {
  userId?: number;
  files?: any;
}

export const createProduct = [
  body("name", "Name is required.").trim().notEmpty().escape(),
  body("description", "Description is required.").trim().notEmpty().escape(),
  body("price", "Price must be number.")
    .isFloat({ gt: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount must be number.")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("inventory", "Stock must be number.").isInt({ min: 0 }),
  body("category", "Category is required.").trim().notEmpty().escape(),
  body("type", "Type is required.").trim().notEmpty().escape(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      if (req.files && req.files.length > 0) {
        // Delete uploaded files
        const originalFileNames = req.files.map((file: any) => file.filename);
        await removeFiles(originalFileNames, null);
      }
      return next(createError(400, errors[0]?.msg, errorCode.VALIDATION_ERROR));
    }

    if (req.files && req.files.length === 0) {
      return next(
        createError(400, "Image is required", errorCode.VALIDATION_ERROR)
      );
    }

    // Authorization
    const userId = req.userId;
    const user = await findUserById(userId!);
    if (user?.role !== "ADMIN") {
      const originalFileNames = req.files.map((file: any) => file.filename);
      await removeFiles(originalFileNames, null);

      return next(
        createError(403, "This action is not allowed.", errorCode.UNAUTHORIZED)
      );
    }

    const { name, description, price, discount, inventory, category, type } =
      req.body;
    const files = req.files;

    res.status(201).json({ message: "Successfully created a new product." });
  },
];
