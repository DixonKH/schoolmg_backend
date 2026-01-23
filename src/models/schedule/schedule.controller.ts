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
}
