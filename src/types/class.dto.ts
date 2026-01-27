import z from "zod";
import { classAverageSchema } from "../schemas/class.schema";

export interface ClassDTO {
    name: string;
    capacity: number;
    teacherId?: string;
}

type ClassTeacherResponse = {
    id: string;
    fullName: string;
    phone: string | null;
}

type ClassStudentResponse = {
    id: string;
    fullName: string;
}

type ClassSubjectResponse = {
    id: string;
    name: string;
}

export interface ClassResponse {
    id: string;
    name: string;
    capacity: number;
    teacher: ClassTeacherResponse | null;
    students: ClassStudentResponse[];
    subjects: ClassSubjectResponse[]
}

export type ClassAverageScoreDTO = z.infer<typeof classAverageSchema>["query"];

export type ClassAverageResponse = {
    classId: string;
    subjectId?: string;
    averageScore: number;
    totalGrade: number
}

