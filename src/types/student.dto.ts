import {z} from "zod";
import { studentAverageSchema } from "../schemas/student.schema";
import { StudentStatus } from "../generated/prisma";

// student.types.ts
export interface CreateStudentDTO {
  email: string;
  username: string;
  password: string;
  fullName: string;
  birthDate: string;
  parentName?: string;
  phone?: string;
  classId: string;
}

export interface StudentResponse {
  id: string;
  email: string;
  username: string;
  fullName: string;
  birthDate: string;
  parentName?: string;
  phone?: string;
  classId: string;
}

export interface GetStudentsQuery {
  page?: number;
  limit?: number;
  status?: StudentStatus;
  classId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface UpdateStudentDTO {
    fullName?: string;
    parentName?: string;
    phone?: string;
    parentPhone?: string;
    avatarPublicId?: string;
    avatar?: string;
    address?: string;
}

export type StudentAverageScoreDTO = z.infer<typeof studentAverageSchema>["query"];

export type StudentAverageResponse = {
    studentId: string;
    subjectId?: string;
    averageScore: number;
    totalScore: number;
}
