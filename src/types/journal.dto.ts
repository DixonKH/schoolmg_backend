import { GradeType } from "../generated/prisma";

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