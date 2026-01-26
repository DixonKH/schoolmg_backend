import { Router } from "express";
import { SubjectController } from "./subject.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";

const router = Router();
const subjectController = new SubjectController();

router.use(authMiddleware);

router.post(
  "/create_subject",
  roleMiddleware("ADMIN"),
  subjectController.createSubject,
);

router.post(
  "/teachers/:teacherId/subjects/:subjectId",
  roleMiddleware("ADMIN"),
  subjectController.attachSubjectToTeacher,
);

router.get(
  "/get_subjects",
  roleMiddleware("TEACHER", "ADMIN"),
  subjectController.getAllSubjects,
);

router.delete(
  "/delete_subject/:subjectId",
  roleMiddleware("ADMIN"),
  subjectController.deleteSubject,
);

router.get(
  "/subject_average_score",
  roleMiddleware("ADMIN", "TEACHER"),
  subjectController.subjectAverageScore,
);

export default router;
