import { Class, PrismaClient } from "../../generated/prisma";
import { ClassAverageScoreDTO } from "../../types/class.dto";
import { ClassService } from "./class.service";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();
const classService = new ClassService(prisma);

export class ClassController {
  async createClass(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { name, capacity, teacherId } = req.body;
      const class_: Class = await classService.createClass({
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
 
  async getAllClasses(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const classes = await classService.getAllClasses();
      return res.status(200).json({
        success: true,
        data: classes,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async classAverageScore(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const {classId, subjectId, from, to} = req.query as ClassAverageScoreDTO;
      const classAverageScore = await classService.classAverageScore({
        classId,
        subjectId,
        from,
        to
      });
      
      return res.status(200).json({
        success: true,
        data: classAverageScore
      })
    }catch(e: any) {
      next(e);
    }
  }
}
