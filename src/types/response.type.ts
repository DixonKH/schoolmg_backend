import { User } from "../generated/prisma/client";

export type PublicUser = Omit<
  User,
  "password"
>;

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}