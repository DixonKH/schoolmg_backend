import { Router } from "express";
import AuthRoutes from "./models/auth/auth.routes"
import AdminRoutes from "./models/admin/admin.route"
import StudentRoutes from "./models/students/student.route"
import TeacherRoutes from "./models/teachers/teacher.route"

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);
router.use("/student", StudentRoutes);
router.use("/teacher", TeacherRoutes);

export default router;