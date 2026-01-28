import {
  Prisma,
  PrismaClient,
  User,
  UserRole,
} from "../../generated/prisma";
import { PaginatedResponse, PublicUser } from "../../types/response.type";
import Errors, { HttpCode, Message } from "../../utils/Error";

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
    search?: string,
  ): Promise<PaginatedResponse<PublicUser>> {
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              username: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
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
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_USER_FOUND);
    }

    console.log("user: ", user);
    return user;
  }

  async deleteUser(id: string): Promise<PublicUser> {
    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) throw new Errors(HttpCode.NOT_FOUND, Message.NO_USER_FOUND);

      const deletedUser = await prisma.user.update({
        where: { id },
        data: { isDeleted: true },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
        },
      });

      if (user.role === UserRole.TEACHER) {
        await prisma.teacher.update({
          where: { userId: id },
          data: { status: "LEFT" },
        });
      }

      if (user.role === UserRole.STUDENT) {
        await prisma.student.update({
          where: { userId: id },
          data: { status: "LEFT" },
        });
      }

      console.log("deletedUser: ", deletedUser);
      return deletedUser;
    });
  }

}
