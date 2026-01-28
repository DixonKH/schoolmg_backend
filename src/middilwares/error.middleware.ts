import { NextFunction, Request, Response } from "express";
import Errors from "../utils/Error";


export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);

    if(err instanceof Errors) {
         res.status(err.code).json(err.toJSON());
         return;
    }

     res.status(Errors.standard.code).json({
        code: Errors.standard.code,
        message: Errors.standard.message
     })
 
}