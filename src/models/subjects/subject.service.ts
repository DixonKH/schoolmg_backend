import { PrismaClient, Subject, Teacher } from "../../generated/prisma";
import {
  SubjectAverageDTO,
  SubjectAverageResponse,
} from "../../types/subject.dto";

export class SubjectService {
  constructor(private prisma: PrismaClient) {}

  async createSubject(subject: string): Promise<Subject> {
    const newSubject = await this.prisma.subject.create({
      data: { name: subject },
    });

    return newSubject;
  }

  async getAllSubjects(): Promise<Subject[]> {
    const subjects = await this.prisma.subject.findMany();
    return subjects;
  }

  async attachSubjectToTeacher(
    teacherId: string,
    subjectId: string,
  ): Promise<Teacher> {
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

  async subjectAverageScore(
    query: SubjectAverageDTO,
  ): Promise<SubjectAverageResponse> {
    const { classId, subjectId, from, to } = query;

    const where: any = {
      classId,
      subjectId,
    };

    if (from && to) {
      where.entries = {
        some: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
          grade: { not: null },
        },
      };
    }

    const journals = await this.prisma.journal.findMany({
      where,
      select: {
        entries: {
          where: {
            grade: { not: null },
            ...(from  || to ? {
              ...(from && { date: { gte: from } }),
              ...(to && { date: { lte: to } }),
            } : {}),
          },
          select: {
            grade: true,
          },
        },
      },
    });

    const allGrades = journals.flatMap((score) => score.entries.map((entry) => entry.grade!));

    if (allGrades.length === 0) {
      return {
        subjectId,
        classId,
        averageScore: 0,
        totalScore: 0,
      };
    }

    const totalScores = allGrades.reduce((sum, grade) => sum + grade, 0);

    const averageScore = Math.round(totalScores / allGrades.length);

    return {
      subjectId,
      classId,
      averageScore,
      totalScore: allGrades.length,
    };
  }
}
