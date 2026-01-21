import { Router } from "express";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { TeacherController } from "./teacher.controller";
import { upload } from "../../middilwares/upload.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";

const router = Router();
const teacherController = new TeacherController();

router.use(authMiddleware);

router.get("/me", teacherController.getMe);

router.put(
  "/me/update_profile",
  teacherController.updateProfile,
);

router.put(
  "/me/update_avatar",
  upload.single("avatar"),
  teacherController.updateAvatar,
);

router.get(
  "/get_teachers",
  roleMiddleware("TEACHER", "ADMIN"),
  teacherController.getAllTeachers,
);

router.post(
  "/create_teacher",
  roleMiddleware("ADMIN"),
  teacherController.createTeacher,
);

export default router;
