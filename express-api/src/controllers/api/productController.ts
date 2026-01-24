import { Request, Response, NextFunction } from "express";
import { query, validationResult } from "express-validator";

import { createError } from "../../utils/error";
import { errorCode } from "../../config";
import { getProductsService } from "../../services/product/productService";
import {
  getCategoryList,
  getTypeList,
} from "../../repository/productRepository";

interface CustomRequest extends Request {
  userId?: number;
}

export const getProductsByPagination = [
  query("cursor", "Cursor must be Product ID.").isInt({ gt: 0 }).optional(),
  query("limit", "Limit number must be unsigned integer.")
    .isInt({ gt: 3 })
    .optional(),
  query("category", "Category must be string.").isString().optional(),
  query("type", "Type must be string.").isString().optional(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(400, errors[0]?.msg, errorCode.VALIDATION_ERROR));
    }

    const lastCursor = req.query.cursor ? Number(req.query.cursor) : undefined; // validated positive int
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const category = req.query.category
      ? req.query.category.toString()
      : undefined;
    const type = req.query.type ? req.query.type.toString() : undefined;

    const { hasNextPage, nextCursor, prevCursor, products } =
      await getProductsService({
        lastCursor,
        limit,
        category,
        type,
        query: req.query,
      });

    res.status(200).json({
      message: "Get All infinite products",
      hasNextPage,
      nextCursor,
      prevCursor,
      products,
    });
  },
];

export const getCategoryType = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const categories = await getCategoryList();
  const types = await getTypeList();

  res.status(200).json({
    message: "Category & Types",
    categories,
    types,
  });
};
