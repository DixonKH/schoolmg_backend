import { User } from "../generated/prisma/client";

/**
 * FE ga yuboriladigan user
 */
export type PublicUser = Omit<
  User,
  "password"
>;

/**
 * Auth response
 */
export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

/**
 * Generic API response
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
