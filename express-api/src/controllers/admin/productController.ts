import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";

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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(400, errors[0]?.msg, errorCode.VALIDATION_ERROR));
    }
    res.status(200).json({ message: "Successfully created a new product." });
  },
];
