import express from "express";
import { healthCheck, register, login, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = express.Router();

router.get("/health", healthCheck);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
outer.post("/logout", protect, logout);

export default router;
