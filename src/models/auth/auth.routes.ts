import express from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";

const router = express.Router();

const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);

// protected routes
router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  //authController.getStudents
);

export default router;
