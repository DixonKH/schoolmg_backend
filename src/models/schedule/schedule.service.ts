import { PrismaClient, Schedule } from "../../generated/prisma";
import { CreateScheduleDto } from "../../types/schedule.dto";

export class ScheduleService {
  constructor(private prisma: PrismaClient) {}

  async createSchedule(data: CreateScheduleDto): Promise<Schedule> {
    const class_ = await this.prisma.class.findUnique({
      where: { id: data.classId },
    });
    if (!class_) throw new Error("Class not found");

    const teacher = await this.prisma.teacher.findUnique({
      where: { id: data.teacherId },
    });
    if (!teacher) throw new Error("Teacher not found");

    const subject = await this.prisma.subject.findUnique({
      where: { id: data.subjectId },
    });
    if (!subject) throw new Error("Subject not found");

    const existing = await this.prisma.schedule.findFirst({
      where: {
        classId: data.classId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
      },
    });
    if (existing)
      throw new Error(
        "Schedule conflict: this class already has a lesson at this time",
      );

    const schedule = await this.prisma.schedule.create({
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
  }
}
