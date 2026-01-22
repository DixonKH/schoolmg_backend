import { GradeType, Prisma } from "../generated/prisma";

export interface JournalCreateDTO {
    date: string;
    classId: string;
    subjectId: string;
    teacherId: string;
}

export interface CreateJournalEntryDTO {
  studentId: string;
  date: string;
  present?: boolean;
  grade?: number;
  gradeType?: GradeType;
}

export interface UpdateJournalEntryDTO {
  studentId: string;
  present?: boolean;
  grade?: number;
  gradeType?: GradeType;
}

export type JournalWithRelations = Prisma.JournalGetPayload<{
    include: {
        class: { select: { id: true, name: true } };
        subject: { select: { id: true, name: true } };
        teacher: { select: { id: true, fullName: true } };
        entries: {
            include: {
                student: { select: { id: true, fullName: true } },
            }
        }
    }
}>