import { Request, Response, NextFunction } from "express";
import { PrismaClient, Student } from "../../generated/prisma";
import { StudentService } from "./student.service";
import { AuthRequest } from "../../types/request.type";
import { CreateStudentDTO, StudentAverageScoreDTO, StudentResponse, UpdateStudentDTO } from "../../types/student.dto";

const prisma = new PrismaClient();
const studentService = new StudentService(prisma);

export class StudentController {

   async createStudent(
     req: Request,
     res: Response,
     next: NextFunction,
   ): Promise<Response | undefined> {
     try {
       const student: StudentResponse = await studentService.createStudent(
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
      const user = await studentService.updateProfile(userId, req.body as UpdateStudentDTO);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateAvatar(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> {
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
        message: "Avatar updated successfully",
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAllStudentsByClass(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { classId } = req.params;
      const students: Student[] =
        await studentService.getAllStudentsByClass(classId);
  
      return res.status(200).json({
        success: true,
        data: students,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async studentAverageScore(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
       const {studentId, subjectId, from, to} = req.query as StudentAverageScoreDTO;

       const studentAverageScore = await studentService.studentAverageScore({
         studentId,
         subjectId,
         from,
         to
       });

       return res.status(200).json({
         success: true,
         data: studentAverageScore
       })
    }catch(e: any) {
      next(e);
    }
  }
}
