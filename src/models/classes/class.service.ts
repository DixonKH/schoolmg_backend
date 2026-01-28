import { Class, PrismaClient } from "../../generated/prisma";
import { ClassAverageResponse, ClassAverageScoreDTO, ClassDTO, ClassResponse } from "../../types/class.dto";
import Errors, { HttpCode, Message } from "../../utils/Error";

export class ClassService {
  constructor(private prisma: PrismaClient) {}

  async createClass(data: ClassDTO): Promise<Class> {
    if (data.teacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: data.teacherId },
      });

      if (!teacher) {
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_USER_FOUND);
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
 
  async getAllClasses(): Promise<ClassResponse[]> {
    const classes = await this.prisma.class.findMany({
      select: {
        id: true,
        name: true,
        capacity: true,
        teacher: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        students: {
         select: {
          id: true,
          fullName: true
         }
        },
        subjects: {
          select: {
           id: true,
           name: true
          }
        }
      }
    });
    if(classes.length === 0) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    console.log("classes: ", classes);
    return classes;
  }

  async classAverageScore(query: ClassAverageScoreDTO): Promise<ClassAverageResponse> {
    const { classId, subjectId, from, to } = query;
    const classGrade = await this.prisma.journalEntry.findMany({
      where: {
        ...(classId || subjectId ? {journal: {
          ...(classId && {classId}),
          ...(subjectId && {subjectId})
        }} : {}),
        grade: { not: null },
        ...(from || to ? {
          ...(from && {date: {gte: from}}),
          ...(to && {date: {lte: to}})
        } : {})
      },
      select: {grade: true}
    });

    if(classGrade.length === 0) {
       return {
          classId,
          subjectId: undefined,
          averageScore: 0,
          totalGrade: 0
       }
    }
    const totalGrade = classGrade.reduce((acc, curr) => acc + (curr.grade ?? 0), 0);
    const averageScore = Math.round(totalGrade / classGrade.length);
    return{
      classId,
      subjectId,
      averageScore,
      totalGrade
    }
  }
}
