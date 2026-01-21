import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";

const router = Router();
const scheduleController = new ScheduleController();

router.use(authMiddleware);

router.post("/create_schedule", roleMiddleware("ADMIN"), scheduleController.createSchedule);

export default router;