import { Class, PrismaClient } from "../../generated/prisma";
import { ClassDTO } from "../../types/class.dto";

export class ClassService {
  constructor(private prisma: PrismaClient) {}

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

  async getAllClasses(): Promise<any[]> {
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
    if(!classes.length) throw new Error("Classes not found");

    const response = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      capacity: cls.capacity,
      teacher: cls.teacher ? {id: cls.teacher.id, fullName: cls.teacher.fullName, phone: cls.teacher.phone} : null,
      students: cls.students.map((s) => ({id: s.id, fullName: s.fullName})),
      subjects: cls.subjects.map((s) => ({id: s.id, name: s.name}))
    }))

    console.log("classes: ", response);
    return response;
  }
}
