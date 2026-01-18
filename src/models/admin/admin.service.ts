import { Prisma, PrismaClient, User, UserRole } from "../../generated/prisma";
import {
  CreateStudentDTO,
  CreateTeacherDTO,
  StudentResponse,
  TeacherResponse,
} from "../../types/admin.dto";
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
      throw new Error("User not found");
    }

    console.log("user: ", user);
    return user;
  }

  async deleteUser(id: string): Promise<PublicUser> {
    const deletedUser = await this.prisma.user.update({
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
    if (!deletedUser) {
      throw new Error("User not found");
    }

    console.log("deletedUser: ", deletedUser);

    return deletedUser;
  }

  async createStudent(data: CreateStudentDTO): Promise<StudentResponse> {
    const hashed = await bcrypt.hash(data.password, 10);
    
    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: hashed,
          role: UserRole.STUDENT,
        },
      });

      const student = await prisma.student.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          birthDate: data.birthDate,
          parentName: data.parentName,
          phone: data.phone,
        },
      });

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: student.fullName,
        birthDate: student.birthDate,
        parentName: student.parentName ?? undefined,
        phone: student.phone ?? undefined,
      };
    });
  }

  async createTeacher(data: CreateTeacherDTO): Promise<TeacherResponse> {
       const hashed = await bcrypt.hash(data.password, 10);

      return await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email: data.email,
            username: data.username,
            password: hashed,
            role: UserRole.TEACHER,
          }
        });

        const teacher = await prisma.teacher.create({
          data: {
            userId: user.id,
            fullName: data.fullName,
            phone: data.phone
          }
        });

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: teacher.fullName,
          phone: teacher.phone || undefined
        }
      });
  }
}
