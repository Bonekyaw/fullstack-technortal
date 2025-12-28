import express from "express";
import {
  login,
  register,
  verifyOtp,
  confirmPassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp); // http://localhost:8080/api/v1/verify-otp
router.post("/confirm-password", confirmPassword);
router.post("/login", login); // http://localhost:8080/api/v1/login

export default router;
