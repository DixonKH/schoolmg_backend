import { Router } from "express";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { TeacherController } from "./teacher.controller";
import { upload } from "../../middilwares/upload.middleware";

const router = Router();
const teacherController = new TeacherController();

router.get("/me", authMiddleware, teacherController.getMe);

router.put(
  "/me/update_profile",
  authMiddleware,
  teacherController.updateProfile,
);

router.put(
  "/me/update_avatar",
  authMiddleware,
  upload.single("avatar"),
  teacherController.updateAvatar,
);

export default router;
