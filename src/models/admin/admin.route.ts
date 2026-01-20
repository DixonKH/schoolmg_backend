import express from "express";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";
import { AdminController } from "./admin.controller";

const router = express.Router();
const adminController = new AdminController();

router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

router.get("/get_stats", adminController.getDashboardStats);

router.get("/all_users", adminController.getAllUsers);

router.get("/user/:id", adminController.getUserById);

router.delete("/user_delete/:id", adminController.deleteUser);

router.post("/create_student", adminController.createStudent);

router.post("/create_teacher", adminController.createTeacher);

router.get("/students/:classId", adminController.getStudentsByClass);

router.post("/create_class", adminController.createClass);

router.post("/add_subject/:teacherId", adminController.addSubject);

export default router;
