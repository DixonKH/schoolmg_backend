import { Router } from "express";
import { ClassController } from "./class.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";

const router = Router();
const classController = new ClassController();
router.use(authMiddleware);

router.post(
  "/create_class",
  roleMiddleware("ADMIN"),
  classController.createClass,
);

router.get(
  "/get_classes",
  roleMiddleware("TEACHER", "ADMIN"),
  classController.getAllClasses,
);

export default router;
