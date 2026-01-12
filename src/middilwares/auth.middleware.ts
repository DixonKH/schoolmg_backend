import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.dto";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
       try {
         const authHeader = req.headers.authorization;

         if(!authHeader) return res.status(401).json({message: "Token yoq"});
             const token = authHeader.split(" ")[1];

         if(!token) return res.status(401).json({message: "Token noto'g'ri"});
         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

         req.user = decoded;

         next();
         
       }catch(e) {
            return res.status(401).json({ message: "Token yaroqsiz" });
       }
}