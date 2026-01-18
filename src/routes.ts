import { Router } from "express";
import AuthRoutes from "./models/auth/auth.routes"
import AdminRoutes from "./models/admin/admin.route"
import StudentRoutes from "./models/students/student.route"

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);
router.use("/student", StudentRoutes);

export default router;