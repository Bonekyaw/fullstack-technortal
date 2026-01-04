import express from "express";
import { authCheck } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/auth-check", auth, authCheck); // http://localhost:8080/api/v1/users/auth-check

export default router;
