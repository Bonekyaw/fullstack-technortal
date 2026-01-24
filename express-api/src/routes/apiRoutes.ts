import express from "express";
import { authCheck } from "../controllers/authController";
import { auth } from "../middleware/auth";
import {
  getCategoryType,
  getProductsByPagination,
} from "../controllers/api/productController";

const router = express.Router();

router.get("/auth-check", auth, authCheck); // http://localhost:8080/api/v1/users/auth-check
router.get("/products", auth, getProductsByPagination); // Cursor-based Pagination
router.get("/filter-type", auth, getCategoryType);

export default router;
