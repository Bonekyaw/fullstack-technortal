import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./apiRoutes";

const router = express.Router();

router.use("/api/v1", authRoutes); // http://localhost:8080/api/v1/...
router.use("/api/v1/users", userRoutes); // http://localhost:8080/api/v1/users...

export default router;
