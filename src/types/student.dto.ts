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

export interface UpdateStudentDTO {
    fullName?: string;
    parentName?: string;
    phone?: string;
    parentPhone?: string;
    avatarPublicId?: string;
    avatar?: string;
    address?: string;
}