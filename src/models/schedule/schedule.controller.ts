import { PrismaClient } from "../../generated/prisma";
import { ScheduleService } from "./schedule.service";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();
const scheduleService = new ScheduleService(prisma);

export class ScheduleController {
  async createSchedule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const schedule = await scheduleService.createSchedule(req.body);
 
      return res.status(200).json({
        success: true,
        message: "Schedule created successfully",
        data: schedule,
      });
    } catch (e) {
      next(e);
    }
  }

  async getClassSchedules(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { id } = req.params;
      if (!id) throw new Error("classId is required");

      const schedules = await scheduleService.getClassSchedules(id);
 
      return res.status(200).json({
        success: true,
        data: schedules,
      });
    } catch (e) {
      next(e);
    }
  }
}
