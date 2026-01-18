import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { PrismaClient, User } from "../../generated/prisma";
import { CreateStudentDTO, CreateTeacherDTO, StudentResponse, TeacherResponse } from "../../types/admin.dto";
import { PaginatedResponse, PublicUser } from "../../types/response.type";


const prisma = new PrismaClient();
const adminService = new AdminService(prisma);

export class AdminController {
  
  async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
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

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const allUsers: PaginatedResponse<PublicUser> = await adminService.getAllUsers(page, limit, search);

      return res.status(200).json({
        success: true,
        allUsers,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const user: User | null = await adminService.getUserById(req.params.id);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const user: PublicUser = await adminService.deleteUser(req.params.id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createStudent(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const student: StudentResponse = await adminService.createStudent(req.body as CreateStudentDTO);

      return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: student,
      }); 
    } catch (error: any) {
      next(error);
    }
  }

  async createTeacher(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const teacher: TeacherResponse = await adminService.createTeacher(req.body as CreateTeacherDTO);
       
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: teacher,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
