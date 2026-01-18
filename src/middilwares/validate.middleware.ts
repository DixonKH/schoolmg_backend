import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";


export const validateMiddleware = (schema: ZodSchema<any>) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try{
                schema.parse(req.body);
                next();
            }catch(e:any) {
               return res.status(400).json({
                    success: false,
                    message: e.message?.map((error: any) => error.message).join(", ") || e.message,
                    
                });
            }
        };
    };