import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";


export const validateMiddleware = (schema: ZodSchema<any>) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try{
                schema.parse(req.body);
                next();
            }catch(e:any) {
              if (e instanceof ZodError) {
                // ZodError da issues array bor
                const messages = e.issues.map(issue => issue.message).join(", ");
                return res.status(400).json({
                    success: false,
                    message: messages,
                });
            }
            // boshqa xatolar uchun fallback
            return res.status(400).json({
                success: false,
                message: e.message || "Validation error",
            });
            }
        };
    };