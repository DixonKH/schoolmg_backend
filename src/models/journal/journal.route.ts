import { Router } from "express";
import { JournalController } from "./journal.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";

const router = Router();
const journalController = new JournalController();

router.use(authMiddleware);

