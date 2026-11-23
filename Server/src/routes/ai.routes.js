import express from "express";
import { recommendLawyer } from "../controllers/ai.controller.js";

const router = express.Router();

// POST /api/ai/recommend
router.post("/recommend", recommendLawyer);

export default router;