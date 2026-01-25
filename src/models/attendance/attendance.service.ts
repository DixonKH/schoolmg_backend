import { en, tr } from "zod/v4/locales";
import { PrismaClient } from "../../generated/prisma";
import {
  AttendanceWithEntries,
  AttendanceWithRelations,
  CreateAttendanceDTO,
  GetAttendanceQuery,
  StudentAttendancePercent,
} from "../../types/attendance.dto";

export class AttendanceService {
  constructor(private prisma: PrismaClient) {}

  async createAttendance(
    data: CreateAttendanceDTO,
  ): Promise<AttendanceWithEntries> {
    return this.prisma.$transaction(async (prisma) => {
      const schedule = await prisma.schedule.findUnique({
        where: { id: data.scheduleId },
      });

      if (!schedule) throw new Error("Schedule not found");

      const attendance = await prisma.attendance.upsert({
        where: {
          scheduleId_date: { scheduleId: data.scheduleId, date: data.date },
        },
        create: {
          scheduleId: data.scheduleId,
          date: data.date,
        },
        update: {},
      });

      // Delete all entries for this attendance
      await prisma.attendanceEntry.deleteMany({
        where: { attendanceId: attendance.id },
      });

      // Create new entries(bulk)
      await prisma.attendanceEntry.createMany({
        data: data.entries.map((entry) => ({
          attendanceId: attendance.id,
          studentId: entry.studentId,
          present: entry.present,
        })),
      });

      const result = await prisma.attendance.findUnique({
        where: { id: attendance.id },
        include: {
          entries: {
            include: {
              student: {
                select: { id: true, fullName: true },
              },
            },
          },
          schedule: true,
        },
      });

      if (!result) throw new Error("Failed to retrieve created attendance");
      return result;
    });
  }

  async getAttendances(
    query: GetAttendanceQuery,
    user: any,
  ): Promise<AttendanceWithRelations[]> {
    const where: any = {};

    if (query.scheduleId) where.scheduleId = query.scheduleId;

    if (user.role === "STUDENT") {
      where.entries = {
        some: {
          studentId: user.studentId,
        },
      };
    }

    if (user.role === "TEACHER") {
      where.schedule = {
        teacherId: user.teacherId,
      };
    }

    return await this.prisma.attendance.findMany({
      where,
      include: {
        entries: {
          include: { student: true },
        },
        schedule: true,
      },
    });
  }

  async getStudentAttendancePersent(studentId: string): Promise<StudentAttendancePercent> {
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
      })

      if (!student) throw new Error("Student not found")

    const entries = await this.prisma.attendanceEntry.findMany({
      where: {studentId},
      select: { present: true },
    });

    const totalLessons = entries.length;

    if(totalLessons === 0) {
      return {
        studentId,
        totalLessons,
        presentLessons: 0,
        attendancePercent: 0,
      }
    }
    const presentLessons = entries.filter(entry => entry.present).length;

    const attendancePercent = (presentLessons / totalLessons) * 100;
    return {
      studentId,
      totalLessons,
      presentLessons,
      attendancePercent,
    };
  }
}
