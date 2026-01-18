import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { PrismaClient, User } from "../../generated/prisma";
import { ApiResponse, AuthResponse } from "../../types/response.type";

const prisma = new PrismaClient();
const adminService = new AdminService(prisma);

export class AdminController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { totalUsers, roleStats } = await adminService.getDashboardStats();
      return res.status(200).json({
        success: true,
        data: {
          totalUsers,
          roleStats,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const allUsers = await adminService.getAllUsers(page, limit, search);

      return res.status(200).json({
        success: true,
        allUsers,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.getUserById(req.params.id);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.deleteUser(req.params.id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.createUser(req.body);

      return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
