import express from "express";
import { StudentController } from "./student.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { upload } from "../../middilwares/upload.middleware";
import { validateMiddleware } from "../../middilwares/validate.middleware";
import { updateUserSchema } from "../../schemas/student.schema";

const router = express.Router();
const studentController = new StudentController();

router.get("/me", authMiddleware, studentController.getMe);

router.put(
  "/me/update",
  authMiddleware,
  validateMiddleware(updateUserSchema),
  studentController.updateProfile,
);
router.put(
  "/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  studentController.updateAvatar,
);

export default router;
