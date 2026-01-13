import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/request.type";


export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
       try {
         const authHeader = req.headers.authorization;

         if(!authHeader) return res.status(401).json({message: "Token yoq"});
             const token = authHeader.split(" ")[1];

         if(!token) return res.status(401).json({message: "Token noto'g'ri"});
         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

         req.user = decoded;

         next();
         
       }catch(e) {
            return res.status(401).json({ message: "Token yaroqsiz" });
       }
}