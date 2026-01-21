import { Router } from "express";
import { SubjectController } from "./subject.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";

const router = Router();
const subjectController = new SubjectController();

router.use(authMiddleware);

router.post(
  "/add_subject/:teacherId",
  roleMiddleware("ADMIN"),
  subjectController.addSubject,
);

router.get(
  "/get_subjects/:classId",
  roleMiddleware("TEACHER", "ADMIN"),
  subjectController.getAllSubjectsByClass,
);

router.delete(
  "/delete_subject/:subjectId",
  roleMiddleware("ADMIN"),
  subjectController.deleteSubject,
); 


export default router;
