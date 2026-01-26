import express from "express";
import { StudentController } from "./student.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { upload } from "../../middilwares/upload.middleware";
import { validateMiddleware } from "../../middilwares/validate.middleware";
import {
  studentAverageSchema,
  updateUserSchema,
} from "../../schemas/student.schema";
import { roleMiddleware } from "../../middilwares/role.middleware";

const router = express.Router();
const studentController = new StudentController();

router.use(authMiddleware);

router.post(
  "/create_student",
  roleMiddleware("ADMIN"),
  studentController.createStudent,
);

router.get("/me", studentController.getMe);

router.put(
  "/me/update",
  validateMiddleware(updateUserSchema),
  studentController.updateProfile,
);
router.put(
  "/me/avatar",
  upload.single("avatar"),
  studentController.updateAvatar,
);

router.get("/get_students/:classId", studentController.getAllStudentsByClass);

router.get(
  "/average_score",
  validateMiddleware(studentAverageSchema),
  studentController.studentAverageScore,
);

export default router;
