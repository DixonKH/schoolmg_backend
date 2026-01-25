 import { Router } from "express";
 import { AttendanceController } from "./attendace.controller";
 import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";
 
 const router = Router();
 const attendanceController = new AttendanceController();
 
 router.use(authMiddleware);
 
 router.post(
   "/create_attendance",
   roleMiddleware("TEACHER", "ADMIN"),
   attendanceController.createAttendance,
 );
 
router.get("/get_attendances", attendanceController.getAttendances);

router.get("/student_attendance/:studentId", attendanceController.getStudentAttendancePersent);
 
 export default router;