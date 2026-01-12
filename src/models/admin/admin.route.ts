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

export default router;
