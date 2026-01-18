import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";
import { StudentService } from "./student.service";
import { AuthRequest } from "../../types/request.type";

const prisma = new PrismaClient();
const studentService = new StudentService(prisma);

export class StudentController {

    async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await studentService.getMe(req.params.id);
    
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
}