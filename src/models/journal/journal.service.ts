import {
  Journal,
  JournalEntry,
  Prisma,
  PrismaClient,
} from "../../generated/prisma";
import {
  CreateJournalEntryDTO,
  GetAllJournalFilter,
  JournalCreateDTO,
  JournalWithRelations,
  UpdateJournalEntryDTO,
} from "../../types/journal.dto";

export class JournalService {
  constructor(private prisma: PrismaClient) {}

  async getOrCreateJournal(data: JournalCreateDTO): Promise<Journal> {
    const { date, classId, subjectId } = data;
    const journal = await this.prisma.journal.findUnique({
      where: {
        date_classId_subjectId: {
          date: date,
          classId: classId,
          subjectId: subjectId,
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

  async getJournalById(id: string): Promise<JournalWithRelations> {
    const journal = await this.prisma.journal.findUnique({
      where: { id },
      include: {
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, fullName: true } },
        entries: {
          orderBy: { student: { fullName: "asc" } },
          include: {
            student: { select: { id: true, fullName: true } },
          },
        },
      },
    });
    if (!journal) throw new Error("Journal not found");

    console.log("journal: ", journal);
    return journal satisfies JournalWithRelations;
  }

  async getAllJournals(filter: GetAllJournalFilter) {
    const { classId, subjectId, teacherId, fromDate, toDate } = filter;

    const where: Prisma.JournalWhereInput = {
      ...(classId && { classId }),
      ...(subjectId && { subjectId }),
      ...(teacherId && { teacherId }),
      ...(fromDate || toDate
        ? {
            date: {
              ...(fromDate && { gte: fromDate }),
              ...(toDate && { lte: toDate }),
            },
          }
        : {}),
    };

    const alljournals = await this.prisma.journal.findMany({
      where,
      include: {
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
    });

    if (!alljournals.length) throw new Error("Journals not found");

    return alljournals;
  }

  async createJournalEntry(
    journalId: string,
    data: CreateJournalEntryDTO,
  ): Promise<JournalEntry> {
    return await this.prisma.$transaction(async (tx) => {
      const journal = await tx.journal.findUnique({
        where: { id: journalId },
      });
      if (!journal) throw new Error("Journal not found");

      const journalEntry = await this.prisma.journalEntry.create({
        data: {
          journalId,
          studentId: data.studentId,
          date: data.date,
          present: data.present ?? null,
          grade: data.grade ?? null,
          gradeType: data.gradeType ?? null,
        },
      });

      await this.syncGradeFromJournalEntry(tx, journalEntry, journal);

      return journalEntry;
    })
  }

  async bulkCreateEntries(
    journalId: string,
    entries: any[],
  ): Promise<JournalEntry[]> {
    return this.prisma.$transaction(async (tx) => {
      const createdEntries = [];

      for (const entry of entries) {
        const exist = await tx.journalEntry.findUnique({
          where: {
            journalId_studentId: {
              journalId,
              studentId: entry.studentId,
            },
          },
        });
        if (exist) continue; // skip

        const journalEntries = await tx.journalEntry.create({
          data: {
            journalId,
            studentId: entry.studentId,
            date: entry.date,
            present: entry.present ?? null,
            grade: entry.grade ?? null,
            gradeType: entry.gradeType ?? null,
          },
        });
        createdEntries.push(journalEntries);
      }

      console.log("createdEntries: ", createdEntries);
      return createdEntries;
    });
  }

  async bulkUpdateEntries(
    journalId: string,
    entries: UpdateJournalEntryDTO[],
  ): Promise<{ updated: number }> {
    return this.prisma.$transaction(async (txt) => {

      const journal = await txt.journal.findUnique({ where: { id: journalId }});

      for (const e of entries) {
       const entry = await txt.journalEntry.update({
          where: {
            journalId_studentId: {
              journalId,
              studentId: e.studentId,
            },
          },
          data: {
            present: e.present ?? null,
            grade: e.grade ?? null,
            gradeType: e.gradeType ?? null,
          },
        });

        await this.syncGradeFromJournalEntry(txt, entry, journal);
      }
      return { updated: entries.length };
    });
  }

  async syncGradeFromJournalEntry(tx: any, entry: any, journal: any) {
    if(entry.grade == null) return;

    await tx.grade.upsert({
      where: {
        studentId_subjectId_date: {
          studentId: entry.studentId,
          subjectId: journal.subjectId,
          date: entry.date,
        }
      },
      update: {
        value: entry.grade,
        type: entry.gradeType,
      },
      create: {
        value: entry.grade,
        type: entry.gradeType,
        date: entry.date,
        studentId: entry.studentId,
        subjectId: journal.subjectId,
      }
    });
  }
}
