import { UserRole } from "../generated/prisma";

export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}