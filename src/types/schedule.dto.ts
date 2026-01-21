import { WeekDay } from "../generated/prisma";

export interface CreateScheduleDto {
    dayOfWeek: WeekDay;
    startTime: string;
    endTime: string;
    room: string;
    teacherId: string;
    subjectId: string;
    classId: string;
}   