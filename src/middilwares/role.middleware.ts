import { Request, Response, NextFunction } from "express";
import { UserRole } from "../generated/prisma";
import { AuthRequest } from "../types/request.type";


export const roleMiddleware = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if(!user) return res.status(401).json({message: "User not found"});
        if(!roles.includes(user.role)) return res.status(403).json({message: "Access denied"});
        next();
    };
}