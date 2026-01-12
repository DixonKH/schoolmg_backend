import { PrismaClient, User, UserRole } from "../../generated/prisma";
import { CreateUserDTO } from "../../types/admin.dto";
import * as bcrypt from "bcrypt";

export class AdminService {
  constructor(private prisma: PrismaClient) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const roleStats = await this.prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    console.log("totalUsers: ", totalUsers);
    console.log("roleStats: ", roleStats);

    return {
      totalUsers,
      roleStats,
    };
  }

  async getAllUsers(): Promise<Omit<User, "password">[]> {
    const allUsers = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    console.log("allUsers: ", allUsers);

    return allUsers;
  }

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUserRole(id: string, role: UserRole) {
    return await this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async createUser(data: CreateUserDTO) {
    const hashed = await bcrypt.hash(data.password, 10);
    return await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.email,
        role: data.role,
        password: hashed,
      },
    });
  }
}
