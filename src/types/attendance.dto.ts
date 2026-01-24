import { Prisma } from "../generated/prisma";

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
