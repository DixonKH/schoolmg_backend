import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { JournalService } from "./journal.service";

const prisma= new PrismaClient();
const journalService = new JournalService(prisma);

export class JournalController {
      async getOrCreateJournal(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
          try {
              const journal = req.body;
              const newJournal = await journalService.getOrCreateJournal(journal);
              
              return res.status(200).json({
                  success: true,
                  message: "Journal created successfully",
                  data: newJournal,
              });
          }catch(e: any) {
            next(e);
          }
      }

      async createJournalEntry(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
          try {
            const journalEntry = req.body;
            const journalId = req.params.id;
            console.log("journalId: ", journalId);
            const newJournalEntry = await journalService.createJournalEntry(journalId, journalEntry);
            
            return res.status(200).json({
                success: true,
                message: "Journal entry created successfully",
                data: newJournalEntry,
            });

          }catch(e: any) {
            next(e);
          }
      }

      async bulkCreateEntries(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
          try {
            const {entries} = req.body;
            const journalId = req.params.id;
            
            const newJournalEntry = await journalService.bulkCreateEntries(journalId, entries);
            
            return res.status(200).json({
                success: true,
                message: "Journal entry created successfully",
                data: newJournalEntry,
            });

          }catch(e: any) {
            next(e);
          }
      }
}