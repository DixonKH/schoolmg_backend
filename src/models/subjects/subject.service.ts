import { PrismaClient, Subject } from "../../generated/prisma";


export class SubjectService {
    constructor(private prisma: PrismaClient) {}

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

  async getAllSubjectsByClass(classId: string) {
    return await this.prisma.subject.findMany({
      where: {classId},
      include: {
        teacher: {
          select: {fullName: true}
        }
      }
    })
  }
}