import { UserRole } from "../generated/prisma";

export interface RegisterDTO {
    email: string;
    password: string;
    username: string;
    role: UserRole;
}

export interface LoginDTO {
    username: string;
    password: string;
}

export interface JwtPayload {
  userId: string;
  role: string;
}