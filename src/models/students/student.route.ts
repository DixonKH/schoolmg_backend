import express from "express";
import { StudentController } from "./student.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";

const router = express.Router();
const studentController = new StudentController();

router.get("/me/:id", authMiddleware, studentController.getMe);
router.put("/me", authMiddleware, studentController.updateProfile);

export default router;