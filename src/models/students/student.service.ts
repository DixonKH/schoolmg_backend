import cloudinary from "../../config/cloudinary";
import { PrismaClient, Student } from "../../generated/prisma";
import { UpdateStudentDTO } from "../../types/student.dto";

export class StudentService {
  constructor(private prisma: PrismaClient) {}

  async getMe(userId: string): Promise<Student> {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  }

  async updateProfile(userId: string, data: UpdateStudentDTO): Promise<Student> {
    const user = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!user) throw new Error("Student not found");

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
}
