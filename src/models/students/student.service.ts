import { PrismaClient, Student } from "../../generated/prisma";
import { UpdateUserDTO } from "../../types/update.dto";



export class StudentService {
    constructor(private prisma: PrismaClient) {}

    async getMe(userId: string): Promise<Student> {
        const student = await this.prisma.student.findUnique({
            where: { userId }
        })
     if(!student) {
        throw new Error("Student not found")
     }
     return student;
    }

    async updateProfile(userId: string, data: UpdateUserDTO): Promise<Student> {
        const cleanData: Partial<UpdateUserDTO> = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        )
         
          const student = await this.prisma.student.update({
              where: { userId },
              data: cleanData
          });
        console.log("student: ", student);
          return student
    }
}