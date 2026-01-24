 import { Router } from "express";
 import { AttendanceController } from "./attendace.controller";
 import { authMiddleware } from "../../middilwares/auth.middleware";
 import { validateMiddleware } from "../../middilwares/validate.middleware";
 
 const router = Router();
 const attendanceController = new AttendanceController();
 
 router.use(authMiddleware);
 
//  router.post(
//    "/create_attendance",
//    attendanceController.createAttendance,
//  );
 
//  router.get("/get_attendances", attendanceController.getAttendances);
 
 export default router;