import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { Class, PrismaClient, Student, User } from "../../generated/prisma";
import { CreateTeacherDTO, TeacherResponse } from "../../types/teacher.dto";
import { PaginatedResponse, PublicUser } from "../../types/response.type";
import { CreateStudentDTO, StudentResponse } from "../../types/student.dto";
import { success } from "zod";

const prisma = new PrismaClient();
const adminService = new AdminService(prisma);

export class AdminController {
  async getDashboardStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
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

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const allUsers: PaginatedResponse<PublicUser> =
        await adminService.getAllUsers(page, limit, search);

      return res.status(200).json({
        success: true,
        allUsers,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
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

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
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
// student
  async createStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const student: StudentResponse = await adminService.createStudent(
        req.body as CreateStudentDTO,
      );

      return res.status(200).json({
        success: true,
        message: "Student created successfully",
        data: student,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // teacher
  async createTeacher(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const teacher: TeacherResponse = await adminService.createTeacher(
        req.body as CreateTeacherDTO,
      );

      return res.status(200).json({
        success: true,
        message: "Teacher created successfully",
        data: teacher,
      });
    } catch (error: any) {
      next(error);
    }
  }

// class
  async getAllStudentsByClass(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { classId } = req.params;
      const students: Student[] =
        await adminService.getAllStudentsByClass(classId);

      return res.status(200).json({
        success: true,
        data: students,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async createClass(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { name, capacity, teacherId } = req.body;
      const class_: Class = await adminService.createClass({
        name,
        capacity,
        teacherId,
      });

      return res.status(200).json({
        success: true,
        message: "Class created successfully",
        data: class_,
      });
    } catch (e: any) {
      next(e);
    }
  }

  // subject
  async addSubject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { teacherId } = req.params;
      const { subject } = req.body;
      const newSubject = await adminService.addSubject(teacherId, subject);

      return res.status(200).json({
        success: true,
        message: "Subject created successfully",
        data: newSubject,
      });
    } catch (e: any) {
      next(e);
    }
  }
}
