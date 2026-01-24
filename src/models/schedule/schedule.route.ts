import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";
import { validateMiddleware } from "../../middilwares/validate.middleware";
import { scheduleSchema } from "../../schemas/schedule.schema";

const router = Router();
const scheduleController = new ScheduleController();

router.use(authMiddleware);

router.post(
  "/create_schedule",
  roleMiddleware("ADMIN"),
  validateMiddleware(scheduleSchema),
  scheduleController.createSchedule,
);

router.get(
  "/get_schedules/:id",
  scheduleController.getClassSchedules,)

router.get(
  "/get_teacher_schedules/:id",
  roleMiddleware("TEACHER", "ADMIN"),
  scheduleController.getTeacherSchedules,
);

export default router;
