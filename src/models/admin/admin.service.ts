import {
  Class,
  Prisma,
  PrismaClient,
  Schedule,
  Student,
  Subject,
  Teacher,
  User,
  UserRole,
} from "../../generated/prisma";
import { CreateTeacherDTO, TeacherResponse } from "../../types/teacher.dto";
import * as bcrypt from "bcrypt";
import { PaginatedResponse, PublicUser } from "../../types/response.type";
import { ClassDTO } from "../../types/class.dto";
import { CreateStudentDTO, StudentResponse } from "../../types/student.dto";
import { CreateScheduleDto } from "../../types/schedule.dto";

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
    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) throw new Error("User not found");

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

  // teacher
  async createTeacher(data: CreateTeacherDTO): Promise<TeacherResponse> {
    const hashed = await bcrypt.hash(data.password, 10);

    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: hashed,
          role: UserRole.TEACHER,
        },
      });

      const teacher = await prisma.teacher.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          phone: data.phone,
        },
      });

      const subjectRecords = await Promise.all(
        data.subjects.map(async (name) => {
          return await prisma.subject.upsert({
            where: {
              name_classId: {
                name,
                classId: data.classId,
              },
            },
            update: {
              teacherId: teacher.id, // agar oldin bo‘lsa update
            },
            create: {
              name,
              teacherId: teacher.id,
              classId: data.classId,
            },
          });
        }),
      );

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: teacher.fullName,
        phone: teacher.phone || undefined,
        subjects: subjectRecords.map((s) => s.name),
        classId: data.classId,
      };
    });
  }

  async getAllTeachers(): Promise<Teacher[]> {
    const teachers = await this.prisma.teacher.findMany({
      include: {
        subjects: true,
        classes: true,
      },
    });
    console.log("teachers: ", teachers);
    return teachers;
  }

  // student
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
          classId: data.classId,
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
        classId: student.classId,
      };
    });
  }

  async getAllStudentsByClass(classId: string): Promise<Student[]> {
    const students: Student[] = await this.prisma.student.findMany({
      where: { classId },
      include: {
        class: true,
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });
    if (!students) {
      throw new Error("Students not found");
    }
    console.log("students: ", students);
    return students;
  }

  // class
  async createClass(data: ClassDTO): Promise<Class> {
    if (data.teacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: data.teacherId },
      });

      if (!teacher) {
        throw new Error("Teacher not found");
      }
    }

    const class_: Class = await this.prisma.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        teacherId: data.teacherId ?? null,
      },
    });
    console.log("class: ", class_);
    return class_;
  }

  // subject
  async addSubject(teacherId: string, subject: string): Promise<Subject> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { subjects: true },
    });

    if (!teacher) throw new Error("Teacher not found");

    if (teacher.subjects.some((s) => s.name === subject)) {
      throw new Error("Subject already exists");
    }

    const newSubject = await this.prisma.subject.create({
      data: {
        name: subject,
        teacherId,
      },
    });

    console.log("newSubject: ", newSubject);
    return newSubject;
  }

  async deleteSubject(subjectId: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) throw new Error("Subject not found");

    await this.prisma.subject.delete({
      where: { id: subjectId },
    });

    return { message: "Subject deleted" };
  }

  // schedule
  async createSchedule(data: CreateScheduleDto): Promise<Schedule> {
    const class_ = await this.prisma.class.findUnique({
      where: { id: data.classId },
    });
    if (!class_) throw new Error("Class not found");

    const teacher = await this.prisma.teacher.findUnique({
      where: { id: data.teacherId },
    });
    if (!teacher) throw new Error("Teacher not found");

    const subject = await this.prisma.subject.findUnique({
      where: { id: data.subjectId },
    });
    if (!subject) throw new Error("Subject not found");

    const existing = await this.prisma.schedule.findFirst({
      where: {
        classId: data.classId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
      },
    });
    if (existing)
      throw new Error(
        "Schedule conflict: this class already has a lesson at this time",
      );

    const schedule = await this.prisma.schedule.create({
      data: {
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room,
        teacherId: data.teacherId,
        subjectId: data.subjectId,
        classId: data.classId,
      },
    });

    console.log("schedule: ", schedule);
    return schedule;
  }
}
