import { PrismaClient, Subject, Teacher } from "../../generated/prisma";

export class SubjectService {
  constructor(private prisma: PrismaClient) {}

  async createSubject(subject: string): Promise<Subject> {
    const newSubject = await this.prisma.subject.create({
      data: { name: subject },
    });

    return newSubject;
  }

  async attachSubjectToTeacher(teacherId: string, subjectId: string): Promise<Teacher> {
    return this.prisma.teacher.update({
      where: { id: teacherId },
      data: {
        subjects: {
          connect: { id: subjectId },
        },
      },
      include: {
        subjects: true,
      },
    });
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

}
