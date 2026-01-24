import { PrismaClient, Schedule } from "../../generated/prisma";
import { CreateScheduleDto, TeacherWeeklySchedule, WeekSchedule } from "../../types/schedule.dto";

export class ScheduleService {
  constructor(private prisma: PrismaClient) {}

  async createSchedule(data: CreateScheduleDto): Promise<Schedule> {
    return await this.prisma.$transaction(async (tx) => {
      const class_ = await tx.class.findUnique({
        where: { id: data.classId },
      });
      if (!class_) throw new Error("Class not found");

      const teacher = await tx.teacher.findUnique({
        where: { id: data.teacherId },
      });
      if (!teacher) throw new Error("Teacher not found");

      const subject = await tx.subject.findUnique({
        where: { id: data.subjectId },
      });
      if (!subject) throw new Error("Subject not found");

      const classConflict = await tx.schedule.findFirst({
        where: {
          classId: data.classId,
          dayOfWeek: data.dayOfWeek,
          startTime: { lt: data.endTime },
          endTime: { gt: data.startTime },
        },
      });

      if (classConflict) {
        throw new Error(
          "Schedule conflict: class already has a lesson at this time",
        );
      }

      const teacherConflict = await tx.schedule.findFirst({
        where: {
          teacherId: data.teacherId,
          dayOfWeek: data.dayOfWeek,
          startTime: { lt: data.endTime },
          endTime: { gt: data.startTime },
        },
      });

      if (teacherConflict) {
        throw new Error(
          "Schedule conflict: teacher already has a lesson at this time",
        );
      }

      const schedule = await tx.schedule.create({
        data: {
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          room: data.room,
          teacherId: data.teacherId,
          subjectId: data.subjectId,
          classId: data.classId,
        },
      });

      console.log("schedule: ", schedule);
      return schedule;
    });
  }

  async getClassSchedules(classId: string): Promise<WeekSchedule> {
    const class_ = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!class_) throw new Error("Class not found");

    const schedules = await this.prisma.schedule.findMany({
      where: { classId },
      include: {
        subject: {
          select: { id: true, name: true },
        },
        teacher: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: [ {dayOfWeek: "asc"}, {startTime: "asc"} ],
    });

    const weekSchedule: WeekSchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    for (const schedule of schedules) {
      weekSchedule[schedule.dayOfWeek].push({
        id: schedule.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
        subject: schedule.subject,
        teacher: schedule.teacher,
      });
    }

    return weekSchedule;
  }

  async getTeacherSchedules(teacherId: string): Promise<TeacherWeeklySchedule> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) throw new Error("Teacher not found");

    const schedules = await this.prisma.schedule.findMany({
      where: { teacherId },
      include: {
        subject: {
          select: { id: true, name: true },
        },
        class: {
          select: { id: true, name: true },
        },
      },
      orderBy: [ {dayOfWeek: "asc"}, {startTime: "asc"} ],
    });

    const weekSchedule: TeacherWeeklySchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    for (const schedule of schedules) {
      weekSchedule[schedule.dayOfWeek].push({
        id: schedule.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
        subject: schedule.subject,
        class: schedule.class,
      });
    }

    return weekSchedule;
  }
}
