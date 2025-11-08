import express from "express";
import { about, home } from "../controllers/viewController";

const router = express.Router();

router.get("/", home);
router.get("/about", about);

export default router;
