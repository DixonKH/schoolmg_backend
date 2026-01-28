import cloudinary from "../../config/cloudinary";
import { Prisma, PrismaClient, Teacher, UserRole } from "../../generated/prisma";
import { CreateTeacherDTO, TeacherMeResponse, TeacherResponse, UpdateTeacherDTO } from "../../types/teacher.dto";
import * as bcrypt from "bcrypt";
import Errors, { HttpCode, Message } from "../../utils/Error";

export class TeacherService {
  constructor(private prisma: PrismaClient) {}

  async getMe(teacherId: string): Promise<TeacherMeResponse> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: teacherId },
       select: {
        id: true,
        fullName: true,
        phone: true,
        birthDate: true,
        address: true,
        subjects: {
          select: {
            id: true,
            name: true
          }
        },
        classes: {
          select: {
            id: true,
            name: true
          }
        }
       }
    });

    if (!teacher) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_USER_FOUND);
    }

    console.log("teacher: ", teacher);
    return teacher;
  }

  async updateProfile(
    teacherId: string,
    data: UpdateTeacherDTO,
  ): Promise<Teacher> {
    
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: teacherId },
    });
    if (!teacher) throw new Errors(HttpCode.NOT_FOUND, Message.NO_USER_FOUND);

    if(data.avatar && teacher.avatarPublicId) {
      await cloudinary.uploader.destroy(teacher.avatarPublicId);
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    const updatedTeacher = await this.prisma.teacher.update({
      where: { userId: teacherId },
      data: cleanData,
    });

    console.log("updatedTeacher: ", updatedTeacher);
    return updatedTeacher;
  }

  async createTeacher(data: CreateTeacherDTO): Promise<TeacherResponse> {
      const hashed = await bcrypt.hash(data.password, 10);
  
      return this.prisma.$transaction(async (prisma) => {
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
            classes: { connect: data.classIds.map((id) => ({ id }))},
            subjects: { connect: data.subjectIds.map((id) => ({ id }))}
             },
          include: { 
            classes: { select: { id: true, name: true } }, 
            subjects: { select: { id: true, name: true } }
          }
        });
  
        console.log("teacher: ", teacher);
        return {
          id: teacher.id,
          fullName: teacher.fullName,
          phone: teacher.phone || " ",
          email:user.email,
          username:user.username,
          classes: teacher.classes,
          subjects: teacher.subjects
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
} 
