import { Prisma, PrismaClient, User } from "../../generated/prisma";
import { CreateUserDTO } from "../../types/admin.dto";
import * as bcrypt from "bcrypt";
import { PaginatedResponse, PublicUser } from "../../types/response.type";

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

  async getAllUsers(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponse<PublicUser>> {
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { username: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    return {
      items,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log("user: ", user);
    return user;
  }

  async deleteUser(id: string): Promise<PublicUser> {
    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: {isDeleted: true},
      select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true
    }
    });
    if (!deletedUser) {
      throw new Error("User not found");
    }

    console.log("deletedUser: ", deletedUser);

    return deletedUser;
  }

  async createUser(data: CreateUserDTO): Promise<PublicUser> {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        role: data.role,
        password: hashed,
      },
    });

    console.log("user: ", user);
    return user;
  }
}
