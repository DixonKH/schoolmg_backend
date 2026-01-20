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


// teacher
router.post("/create_teacher", adminController.createTeacher);
router.get("/get_teachers", roleMiddleware("TEACHER", "ADMIN"), adminController.getAllTeachers);

// student
router.post("/create_student", adminController.createStudent);
router.get("/students/:classId", adminController.getAllStudentsByClass);

// class
router.post("/create_class", adminController.createClass);

// subject
router.post("/add_subject/:teacherId", adminController.addSubject);

export default router;
