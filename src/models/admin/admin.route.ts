import express from "express";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";
import { AdminController } from "./admin.controller";

const router = express.Router();
const adminController = new AdminController();

router.get(
  "/dashboard/stats",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getDashboardStats
);

router.get(
  "/dashboard/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAllUsers
);

router.get(
  "/dashboard/users/:id", 
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getUserById
);

router.delete(
  "/dashboard/user_delete/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.deleteUser
);

router.post(
  "/create_student",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.createStudent
);

router.post(
  "/create_teacher",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.createTeacher
);

export default router;
