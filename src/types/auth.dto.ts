export interface RegisterDTO {
    email: string;
    password: string;
    username: string;
    role: string;
}

export interface LoginDTO {
    username: string;
    password: string;
}

export interface JwtPayload {
  userId: string;
  role: string;
}