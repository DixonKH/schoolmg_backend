import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";
import { AttendanceService } from "./attendance.service";
import { AuthRequest } from "../../types/request.type";


const prisma = new PrismaClient();
const attendanceService = new AttendanceService(prisma);

export class AttendanceController {
    async createAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const attendance = await attendanceService.createAttendance(req.body);

            return res.status(200).json({
                success: true,
                message: "Attendance created successfully",
                data: attendance,
            });
        }catch(e) {
            next(e);
        }
    }

    async getAttendances(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const attendances = await attendanceService.getAttendances(req.query, req.user!);
            return res.status(200).json({
                success: true,
                data: attendances,
            });
        }catch(e) {
            next(e);
        }
    }
}