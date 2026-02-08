import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { TeacherService } from "./teacher.service";
import { AuthRequest } from "../../types/request.type";
import {
  CreateTeacherDTO,
  TeacherResponse,
  UpdateTeacherDTO,
} from "../../types/teacher.dto";

const prisma = new PrismaClient();
const teacherService = new TeacherService(prisma);

export class TeacherController {

  async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    const teacherId = req.user!.id;
    try {
      const teacher = await teacherService.updateProfile(
        teacherId,
        req.body as UpdateTeacherDTO,
      );

      return res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateAvatar(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    const teacherId = req.user!.id;
    if (!req.file) {
      return res.status(400).json({ message: "Avatar not found" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      throw new Error("Only images allowed");
    }

    const avatarUrl = req.file.path;
    const publicId = req.file.filename;
    console.log("avatarUrl: ", avatarUrl);

    try {
      const teacher = await teacherService.updateProfile(teacherId, {
        avatar: avatarUrl,
        avatarPublicId: publicId,
      });

      return res.status(200).json({
        success: true,
        message: "Avatar updated successfully",
        data: teacher,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAllTeachers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const teachers = await teacherService.getAllTeachers();
      return res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createTeacher(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const teacher: TeacherResponse = await teacherService.createTeacher(
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
}
