import { Router } from "express";
import AuthRoutes from "./models/auth/auth.routes"
import AdminRoutes from "./models/admin/admin.route"
import StudentRoutes from "./models/students/student.route"
import TeacherRoutes from "./models/teachers/teacher.route"
import ClassRoutes from "./models/classes/class.route"
import SubjectRoutes from "./models/subjects/subject.route"
import ScheduleRoutes from "./models/schedule/schedule.route"

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);
router.use("/teacher", TeacherRoutes);
router.use("/student", StudentRoutes);
router.use("/class", ClassRoutes);
router.use("/subject", SubjectRoutes);
router.use("/schedule", ScheduleRoutes);


export default router;