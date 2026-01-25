import z from "zod";
import { Prisma } from "../generated/prisma";
import { AttendanceQuerySchema } from "../schemas/attendance.schema";

export interface CreateAttendanceDTO {
  scheduleId: string;
  date: string;
  entries: {
    studentId: string;
    present: boolean;
  }[];
}

export interface GetAttendanceQuery {
  scheduleId?: string;
  classId?: string;
  subjectId?: string;
  teacherId?: string;
  date?: string;
}

export type AttendanceWithRelations =
  Prisma.AttendanceGetPayload<{
    include: {
      entries: {
        include: { student: true };
      };
      schedule: true;
    };
  }>;


export type AttendanceWithEntries = Prisma.AttendanceGetPayload<{
  include: {
    schedule: true;
    entries: {
      include: {
        student: {
          select: {
            id: true;
            fullName: true;
          };
        };
      };
    };
  };
}>;

export interface StudentAttendancePercent {
  studentId: string;
  totalLessons: number;
  presentLessons: number;
  attendancePercent: number;
}

export type AttendanceStatsQuery =
  z.infer<typeof AttendanceQuerySchema>["query"];

export interface AttendanceStatsResponse {
  totalLessons: number;
  presentLessons: number;
  absentLessons: number;
  attendancePercent: number;
}

export interface TotalAttendanceDTO {
  classId?: string;
  from?: string;
  to?: string;
}

export interface TotalAttendanceResponse {
  totalLessons: number;
  totalStudents: number;
  totalPossibleAttendances: number;
  totalPresentAttendances: number;
  classAttendancePercent: number;
}



