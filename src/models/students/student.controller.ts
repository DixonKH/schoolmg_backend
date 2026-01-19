import { Request, Response, NextFunction } from "express";
import { PrismaClient, Student } from "../../generated/prisma";
import { StudentService } from "./student.service";
import { AuthRequest } from "../../types/request.type";
import { UpdateUserDTO } from "../../types/update.dto";
import cloudinary from "../../config/cloudinary";

const prisma = new PrismaClient();
const studentService = new StudentService(prisma);

export class StudentController {
  async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> {
    const userId = req.user!.id;
    try {
      const user: Student = await studentService.getMe(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction):Promise<Response | undefined> {
    const userId = req.user!.id;

    try {
      const user = await studentService.updateProfile(userId, req.body as UpdateUserDTO);

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

    if (!req.file.mimetype.startsWith("image/")) {
       throw new Error("Only images allowed");
    }

    const avatarUrl = req.file.path;
     const publicId = req.file.filename;
    console.log("avatarUrl: ", avatarUrl);

    try {
      const user = await studentService.updateProfile(userId, {
         avatar: avatarUrl,
         avatarPublicId: publicId
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
