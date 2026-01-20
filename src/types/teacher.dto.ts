export interface CreateTeacherDTO {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phone?: string;
  subjects: string[];
  classId: string;
}

export interface TeacherResponse {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  subjects: string[];
  classId: string;
}

export interface UpdateTeacherDTO {
  fullName?: string;
  phone?: string;
  birthDate?: string;
  avatar?: string;
  avatarPublicId?: string;
  address?: string;
  subjects?: string[];
  classes?: string[];
}
