import { PrismaClient } from "../../generated/prisma";
import { SubjectService } from "./subject.service";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();
const subjectService = new SubjectService(prisma);

export class SubjectController {

    async createSubject(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<Response | undefined> {
      try {
        const { subject } = req.body;
        const newSubject = await subjectService.createSubject(subject);
        
        return res.status(200).json({
          success: true,
          message: "Subject created successfully",
          data: newSubject,
        });
      } catch (e: any) {
        next(e);
      }
    }

    async attachSubjectToTeacher(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
      try {
        const { subjectId, teacherId} = req.params;
        const subject = await subjectService.attachSubjectToTeacher(subjectId, teacherId);
        
        return res.status(200).json({
          success: true,
          message: "Subject attech to teacher successfully",
          data: subject,
        });
      } catch (e: any) {
        next(e);
      }
    }

    async deleteSubject(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
      try {
        const { subjectId } = req.params;
        const deletedSubject = await subjectService.deleteSubject(subjectId);
        
        return res.status(200).json({
          success: true,
          message: "Subject deleted successfully",
          data: deletedSubject,
        });
      } catch (e: any) {
        next(e);
      }
    }
}