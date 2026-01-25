import { Router } from "express";
import { AttendanceController } from "./attendace.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";
import { validateMiddleware } from "../../middilwares/validate.middleware";
import { AttendanceQuerySchema } from "../../schemas/attendance.schema";

const router = Router();
const attendanceController = new AttendanceController();

router.use(authMiddleware);

router.post(
  "/create_attendance",
  roleMiddleware("TEACHER", "ADMIN"),
  attendanceController.createAttendance,
);

router.get("/get_attendances", attendanceController.getAttendances);

router.get(
  "/student_attendance/:studentId",
  attendanceController.getStudentAttendancePersent,
);

router.get(
  "/student_attendance_by_class",
  validateMiddleware(AttendanceQuerySchema),
  attendanceController.getStudentAttendanceByClass,
);

router.get(
  "/attendance_class_performance",
  validateMiddleware(AttendanceQuerySchema),
  attendanceController.attendanceClassPerformance,
);

export default router;
