import { User } from "../generated/prisma/client";

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}
