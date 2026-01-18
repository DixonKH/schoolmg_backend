import type { UserRole } from "../generated/prisma";

// student.types.ts
export interface CreateStudentDTO {
  email: string;
  username: string;
  password: string;
  fullName: string;
  birthDate: string;
  parentName?: string;
  phone?: string;
}

export interface StudentResponse {
  id: string;
  email: string;
  username: string;
  fullName: string;
  birthDate: string;
  parentName?: string;
  phone?: string;
}

// teacher.types.ts
export interface CreateTeacherDTO {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface TeacherResponse {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
}

