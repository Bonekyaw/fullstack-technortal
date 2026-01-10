import express from "express";
import { auth } from "../middleware/auth";
import { createProduct } from "../controllers/admin/productController";
import upload from "../middleware/uploadFile";

const router = express.Router();

router.post("/products/create", auth, upload.array("images", 5), createProduct); // http://localhost:8080/api/v1/users/auth-check

export default router;
