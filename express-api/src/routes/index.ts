import express from "express";
import authRoutes from "./authRoutes";

const router = express.Router();

router.use("/api/v1", authRoutes); // http://localhost:8080/api/v1/...

export default router;
