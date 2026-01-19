import {Router} from "express";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { TeacherController } from "./teacher.controller";

const router = Router();
const teacherController = new TeacherController();

router.get("/me", authMiddleware, teacherController.getMe);
router.put("/me/update_profile", authMiddleware, teacherController.updateProfile);


export default router;