import { PrismaClient } from "../../generated/prisma";


export class JournalService {
    constructor(private prisma: PrismaClient) {
    }
}