import { Journal, PrismaClient } from "../../generated/prisma";
import { JournalCreateDTO } from "../../types/journal.dto";

export class JournalService {
  constructor(private prisma: PrismaClient) {}

  async getOrCreateJournal(data: JournalCreateDTO): Promise<Journal> {
     console.log("DATA:", data);
    const journal = await this.prisma.journal.findUnique({
      where: {
        date_classId_subjectId: {
          date: data.date,
          classId: data.classId,
          subjectId: data.subjectId,
        },
      },
      include: {
        entries: true,
      },
    });

    if (!journal) {
      return await this.prisma.journal.create({
        data: {
          date: data.date,
          classId: data.classId,
          subjectId: data.subjectId,
          teacherId: data.teacherId,
        },
      });
    }
    console.log("journal: ", journal);
    return journal;
  }
}
