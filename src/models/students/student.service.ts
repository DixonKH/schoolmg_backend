import cloudinary from "../../config/cloudinary";
import {
  Prisma,
  PrismaClient,
  Student,
  UserRole,
} from "@prisma/client";
import {
  CreateStudentDTO,
  GetStudentsQuery,
  PaginatedResult,
  StudentAverageResponse,
  StudentAverageScoreDTO,
  StudentResponse,
  UpdateStudentDTO,
} from "../../types/student.dto";
import * as bcrypt from "bcrypt";
import Errors, { HttpCode, Message } from "../../utils/Error";

type StudentWithClass = Prisma.StudentGetPayload<{
  include: {
    class: {
      select: { id: true; name: true };
    };
  };
}>;

export class StudentService {
  constructor(private prisma: PrismaClient) {}

  async createStudent(data: CreateStudentDTO): Promise<StudentResponse> {
    const hashed = await bcrypt.hash(data.password, 10);

    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.EXIST_USER);
    }

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

  async updateProfile(
    userId: string,
    data: UpdateStudentDTO,
  ): Promise<Student> {
    const user = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!user) throw new Errors(HttpCode.NOT_FOUND, Message.NO_USER_FOUND);

    if (data.avatarPublicId && user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    const student = await this.prisma.student.update({
      where: { userId },
      data: cleanData,
    });

    console.log("student: ", student);
    return student;
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
    if (!students.length) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    console.log("students: ", students);
    return students;
  }

  async getAllStudents(
    query: GetStudentsQuery,
  ): Promise<PaginatedResult<StudentWithClass>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {
      ...(query.status && { status: query.status as any }),
      ...(query.classId && { classId: query.classId }),
      ...(query.search && {
        fullName: {
          contains: query.search,
          mode: "insensitive",
        },
      }),
    };

    const students = await this.prisma.student.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        class: { select: { id: true, name: true } },
      },
    });

    const total = await this.prisma.student.count({ where });
    
    if (!students.length) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return {
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async studentAverageScore(
    query: StudentAverageScoreDTO,
  ): Promise<StudentAverageResponse> {
    const { studentId, subjectId, from, to } = query;

    const studentGrades = await this.prisma.journalEntry.findMany({
      where: {
        studentId,
        grade: { not: null },
        ...(from || to
          ? {
              ...(from && { date: { gte: from } }),
              ...(to && { date: { lte: to } }),
            }
          : {}),
        ...(subjectId ? { journal: { subjectId } } : {}),
      },
      select: { grade: true },
    });

    console.log("students: ", studentGrades);
    const totalScore = studentGrades.reduce(
      (acc, curr) => acc + (curr.grade ?? 0),
      0,
    );
    const averageScore = totalScore / studentGrades.length;

    if (studentGrades.length === 0) {
      return {
        studentId,
        subjectId,
        averageScore: 0,
        totalScore: 0,
      };
    }
    return {
      studentId,
      subjectId,
      averageScore,
      totalScore,
    };
  }
}
