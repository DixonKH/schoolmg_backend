import { NextFunction, Request, Response } from "express";


export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "production" && [message, err.stack])
    })
}