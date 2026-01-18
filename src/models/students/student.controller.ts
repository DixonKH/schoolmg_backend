import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";
import { StudentService } from "./student.service";
import { AuthRequest } from "../../types/request.type";

const prisma = new PrismaClient();
const studentService = new StudentService(prisma);

export class StudentController {
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user!.id;
    try {
      const user = await studentService.getMe(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user!.id;

    try {
      const user = await studentService.updateProfile(userId, req.body);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateAvatar(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user!.id;
    if (!req.file) {
      return res.status(400).json({ message: "Avatar not found" });
    }
    const avatarUrl = `/uploads/${req.file.filename}`;

    try {
      const user = await studentService.updateProfile(userId, {
        avatar: avatarUrl,
      });

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
