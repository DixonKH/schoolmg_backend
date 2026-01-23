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

export type ScheduleItem = {
    id: string;
    startTime: string;
    endTime: string;
    room: string;
    subject: {
        id: string;
        name: string;
    };
    teacher:{ 
        id: string;
        fullName: string;
    };
}

export type WeekSchedule = Record<WeekDay, ScheduleItem[]>