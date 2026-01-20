import cloudinary from "../../config/cloudinary";
import { Prisma, PrismaClient, Teacher } from "../../generated/prisma";
import { UpdateTeacherDTO } from "../../types/teacher.dto";

type TeacherWithRelations = Prisma.TeacherGetPayload<{
  include: {
    subjects: true,
    classes: true
  }
}>

export class TeacherService {
  constructor(private prisma: PrismaClient) {}

  async getMe(teacherId: string): Promise<Teacher> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: teacherId },
       include: {
         subjects: true, 
         classes: true     
      }
    });

    if (!teacher) {
      throw new Error("Teacher not found");
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
    if (!teacher) throw new Error("Teacher not found");

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
}
