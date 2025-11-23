import express from "express";
import { login } from "../controllers/authController";

const router = express.Router();

router.post("/login", login); // http://localhost:8080/api/v1/login

export default router;
