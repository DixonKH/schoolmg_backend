export interface CreateTeacherDTO {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phone?: string;

  subjectIds: string[];
  classIds: string[];
}

export interface TeacherResponse {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  classes: {id: string, name: string}[];
  subjects: {id: string, name: string}[];
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

export type TeacherMeResponse = {
  id: string;
  fullName: string;
  phone: string | null;
  birthDate: string | null;
  address: string | null;
  subjects: {id: string, name: string}[];
  classes: {id: string, name: string}[];
}
