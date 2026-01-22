import { Journal, JournalEntry, PrismaClient } from "../../generated/prisma";
import { CreateJournalEntryDTO, JournalCreateDTO } from "../../types/journal.dto";

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

  async createJournalEntry(journalId: string, data: CreateJournalEntryDTO): Promise<JournalEntry> {
     
    const ExistStudent = await this.prisma.student.findUnique({
      where: { id: data.studentId},
    });

    if (!ExistStudent) {
      throw new Error("Student not found");
    }

    const ExistJournalEntry = await this.prisma.journalEntry.findUnique({
        where: {
            journalId_studentId: {
                journalId,
                studentId: data.studentId
            },
        }
    })

    if (ExistJournalEntry) {
        throw new Error("This student already has entry in this journal");
    }

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

     console.log("journalEntry: ", journalEntry);
     return journalEntry;
  }

  async bulkCreateEntries(journalId: string, entries: any[]): Promise<JournalEntry[]> {
    return this.prisma.$transaction(async (tx) => {
       
        const createdEntries = [];

        for(const entry of entries) {
            const exist = await tx.journalEntry.findUnique({
                where: {
                    journalId_studentId: {
                        journalId,
                        studentId: entry.studentId
                    },
                }
            });
            if(exist) continue; // skip

           const journalEntries = await tx.journalEntry.create({
                data: {
                    journalId,
                    studentId: entry.studentId,
                    date: entry.date,
                    present: entry.present ?? null,
                    grade: entry.grade ?? null,
                    gradeType: entry.gradeType ?? null
                }
            })
            createdEntries.push(journalEntries);
        }
        
        console.log("createdEntries: ", createdEntries);
        return createdEntries;
    })
  }
}
