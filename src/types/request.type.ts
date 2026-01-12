import e, { Request } from "express";
import { UserRole } from "../generated/prisma";

export interface AuthRequest extends Request {
    user?: {
        id: string,
        role: UserRole
    }
}