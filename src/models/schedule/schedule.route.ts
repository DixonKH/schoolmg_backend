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

export default router;
