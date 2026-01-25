import { en, tr } from "zod/v4/locales";
import { PrismaClient } from "../../generated/prisma";
import {
  AttendanceStatsQuery,
  AttendanceStatsResponse,
  AttendanceWithEntries,
  AttendanceWithRelations,
  CreateAttendanceDTO,
  GetAttendanceQuery,
  StudentAttendancePercent,
  TotalAttendanceDTO,
  TotalAttendanceResponse,
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

  async getStudentAttendancePersent(
    studentId: string,
  ): Promise<StudentAttendancePercent> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) throw new Error("Student not found");

    const entries = await this.prisma.attendanceEntry.findMany({
      where: { studentId },
      select: { present: true },
    });

    const totalLessons = entries.length;

    if (totalLessons === 0) {
      return {
        studentId,
        totalLessons,
        presentLessons: 0,
        attendancePercent: 0,
      };
    }
    const presentLessons = entries.filter((entry) => entry.present).length;

    const attendancePercent = (presentLessons / totalLessons) * 100;
    return {
      studentId,
      totalLessons,
      presentLessons,
      attendancePercent,
    };
  }

  async getStudentAttendanceByClass(
    query: AttendanceStatsQuery,
  ): Promise<AttendanceStatsResponse> {
    const { studentId, classId, subjectId, from, to } = query;

    const where: any = {
      entries: { some: { studentId }}
    }

    if(classId) {
      where.schedule = {
        ...(where.schedule || {}),
        classId
      }
    }

    if(subjectId) {
      where.schedule = {
        ...(where.schedule || {}),
        subjectId
      }
    }

    if(from || to) {
      where.date = {
        ...(from && {gte: from}),
        ...(to && {lte: to})
      }
    }

    const attendances = await this.prisma.attendance.findMany({
      where,
      include: {
        entries: {
          where: { studentId },
        },
        schedule: true,
      },
    })

    const totalLessons = attendances.length;
    const presentLessons = attendances.reduce((sum, att) => {
       return sum + (att.entries[0]?.present ? 1 : 0);
        }, 0);

    const absentLessons = totalLessons - presentLessons;
    const attendancePercent = totalLessons === 0 ? 0 : Math.round((presentLessons / totalLessons) * 100);

    return {
      totalLessons,
      presentLessons,
      absentLessons,
      attendancePercent,
    };
  }

  async attendanceClassPerformance(query: AttendanceStatsQuery): Promise<TotalAttendanceResponse> {
    const { classId, from, to } = query;

    const where: any = { schedule: { classId } };


    if(from || to) {
         where.date = {  
             ...(from && {gte: from}),
             ...(to && {lte: to})
         }
    }

    const attendances = await this.prisma.attendance.findMany({
      where,
      include: {entries: true},
    });

    const totalStudents = await this.prisma.student.count({where: {classId}});

    let totalPresentAttendances = 0;
    let totalPossibleAttendances = 0;
    
    for (const attendance of attendances) {
      totalPossibleAttendances += totalStudents;

      const presentCount = attendance.entries.filter(entry => entry.present === true).length;
      
      totalPresentAttendances += presentCount;
    }
    
    const totalLessons = attendances.length;
    const classAttendancePercent = totalPossibleAttendances === 0 ? 0 : Math.round(( totalPresentAttendances / totalPossibleAttendances) * 100);
  
   return {
      totalLessons,
      totalStudents,
      totalPresentAttendances,
      totalPossibleAttendances,
      classAttendancePercent,
   };
  }
}
