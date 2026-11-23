import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
import aiRouter from "./src/routes/ai.routes.js";
import lawyerRouter from "./src/routes/lawyer.routes.js";
import clientRouter from "./src/routes/client.routes.js";
import reviewRouter from "./src/routes/review.routes.js";
import caseStudyRouter from "./src/routes/caseStudy.routes.js";
import contactRouter from "./src/routes/contact.routes.js";
import chatRouter from "./src/routes/chat.routes.js";    // ✅ NEW

app.use("/api/ai", aiRouter);
app.use("/lawyer", lawyerRouter);
app.use("/client", clientRouter);
app.use("/review", reviewRouter);
app.use("/casestudy", caseStudyRouter);
app.use("/contact", contactRouter);
app.use("/api/lawyers", lawyerRouter);
app.use("/chat", chatRouter);                            // ✅ NEW

export default app;