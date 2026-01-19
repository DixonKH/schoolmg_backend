import { NextFunction, Request, Response } from "express";
import { PrismaClient, Teacher } from "../../generated/prisma";
import { TeacherService } from "./teacher.service";
import { AuthRequest } from "../../types/request.type";
import { UpdateTeacherDTO } from "../../types/teacher.dto";

const prisma = new PrismaClient();
const teacherService = new TeacherService(prisma);

export class TeacherController {
    async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> {
        const teacherId = req.user!.id;
        try {
          const teacher: Teacher = await teacherService.getMe(teacherId);
  
          return res.status(200).json({
            success: true,
            data: teacher,
          });
        } catch (error: any) {
          next(error);
        }
    }

    async updateProfile(req:AuthRequest, res: Response, next:NextFunction):Promise<Response | undefined> {
        const teacherId = req.user!.id;
        try {
          const teacher = await teacherService.updateProfile(teacherId, req.body as UpdateTeacherDTO);
  
          return res.status(200).json({
            success: true,
            data: teacher,
          });
        } catch (error: any) {
          next(error);
        }
    }
}