import { PrismaClient } from "../../generated/prisma";
import { SubjectService } from "./subject.service";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();
const subjectService = new SubjectService(prisma);

export class SubjectController {

    async addSubject(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<Response | undefined> {
      try {
        const { teacherId } = req.params;
        const { subject } = req.body;
        const newSubject = await subjectService.addSubject(teacherId, subject);
        
        return res.status(200).json({
          success: true,
          message: "Subject created successfully",
          data: newSubject,
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