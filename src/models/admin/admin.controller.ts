import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { PrismaClient, User } from "../../generated/prisma";
import { ApiResponse, AuthResponse } from "../../types/response.type";

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

   async getUserById(req: Request, res: Response) {
    try {
        const user = await adminService.getUserById(req.params.id);

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch(error: any) {
           return res.status(400).json({
               success: false,
               message: error.message
           })
    }
   }

//    async updateUserRole(req: Request, res: Response) {
//       try {
//         const user = await adminService.updateUserRole(req.params.id, req.body.role);

//         return res.status(200).json({
//             success: true,
//             data: user
//         });

//       }catch(e: any) {
//           return res.status(400).json({
//               success: false,
//               message: e.message
//           })

//       }
//    }

async deleteUser(req: Request, res: Response) {
    try {
       const user = await adminService.deleteUser(req.params.id);

       return res.status(200).json({
           success: true,
           message: "User deleted successfully",
           data: user
       });
    }catch(error: any){
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async createUser(req: Request, res: Response) {
    try {
        const user = await adminService.createUser(req.body);

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: user
        });

    }catch(error: any){
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
}