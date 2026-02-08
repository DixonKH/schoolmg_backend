import express from "express";
import { AuthController } from "./auth.controller";
import { validateMiddleware } from "../../middilwares/validate.middleware";
import { registerSchema } from "../../schemas/auth.schema";
import { authMiddleware } from "../../middilwares/auth.middleware";

const router = express.Router();

const authController = new AuthController();

router.post("/register", validateMiddleware(registerSchema), authController.register);
router.post("/login", authController.login);

router.get("/me", authMiddleware, authController.getMe);


export default router;
