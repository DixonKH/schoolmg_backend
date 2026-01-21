import { PrismaClient } from "../../generated/prisma";
import { JournalService } from "./journal.service";

const prisma= new PrismaClient();
const journalService = new JournalService(prisma);

export class JournalController {

}