import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { AuthService } from "./auth.service";

const prisma = new PrismaClient();
const authService = new AuthService(prisma);

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, username, password, role } = req.body;

      const user = await authService.register({
        email,
        username,
        password,
        role,
      });

      const { password: _, ...safeUser } = user;

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: safeUser,
      });
    } catch (e: any) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const { user, token } = await authService.login({ username, password });

      const { password: _, ...safeUser } = user;

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          user: safeUser,
          accsessToken: token,
        },
      });
    } catch (e: any) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
  }
}
