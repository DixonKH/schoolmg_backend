import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();
const adminService = new AdminService(prisma);

export class AdminController {
   async getDashboardStats(req: Request, res: Response) {
       try {
        const { totalUsers, roleStats } = await adminService.getDashboardStats();
       return res.status(200).json({
           success: true,
           data: {
               totalUsers,
               roleStats
           }
       });
       } catch (error: any) {
           return res.status(400).json({
               success: false,
               message: error.message
           });
       }
   }

   async getAllUsers(req: Request, res: Response) {
       try {
        const allUsers = await adminService.getAllUsers();
        return res.status(200).json({
            success: true,
            data: allUsers
        });
       }catch(error: any){
         return res.status(400).json({
             success: false,
             message: error.message
         });
       }
   }
}