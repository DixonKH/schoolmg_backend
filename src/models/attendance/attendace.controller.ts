import { PrismaClient } from "../../generated/prisma";
import { AttendanceService } from "./attendance.service";


const prisma = new PrismaClient();
const attendanceService = new AttendanceService(prisma);

export class AttendanceController {
    
}