import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthService } from "./auth.service";
import { ApiResponse, AuthResponse } from "../../types/response.type";
import { AuthRequest } from "../../types/request.type";
import Errors, { HttpCode, Message } from "../../utils/Error";
import jwt from "jsonwebtoken";
import { success } from "zod";

const prisma = new PrismaClient();
const authService = new AuthService(prisma);

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);

      const { password: _, ...safeUser } = user;

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: safeUser,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const { user, token } = await authService.login({ username, password });

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "30d",
        },
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      const { password: _, ...safeUser } = user;

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          user: safeUser,
          accessToken: token,
        },
      } satisfies ApiResponse<AuthResponse>);
    } catch (e: any) {
      next(e);
    }
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.refresh(req);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      console.log("REQ.USER:", req.user);
      const { id, role } = req.user!;

      let profile: any = null;

      if (role === "STUDENT") {
        profile = await prisma.student.findUnique({
          where: { userId: id },
        });
      }

      if (role === "TEACHER") {
        profile = await prisma.teacher.findUnique({
          where: { userId: id },
          select: {
            id: true,
            fullName: true,
            phone: true,
            birthDate: true,
            address: true,
            subjects: { select: { id: true, name: true } },
            classes: { select: { id: true, name: true } },
          },
        });
      }

      if (role === "ADMIN") {
        profile = await prisma.staff.findUnique({
          where: { userId: id },
          select: {
            username: true,
            fullName: true,
            phone: true,
            position: true,
            avatar: true,
            avatarPublicId: true,
            address: true
          }
        });
      }

      if (!profile) {
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_USER_FOUND);
      }

      return res.status(200).json({
        success: true,
        user: {
          id,
          role,
          ...profile,
        },
      });
    } catch (e: any) {
      next(e);
    }
  }
}
