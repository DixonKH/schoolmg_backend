import { Router } from "express";
import { JournalController } from "./journal.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";

const router = Router();
const journalController = new JournalController();

router.use(authMiddleware);

router.post(
  "/get_or_create",
  roleMiddleware("TEACHER", "ADMIN"),
  journalController.getOrCreateJournal,
);

router.post(
  "/create_entry/:id/entries",
  roleMiddleware("ADMIN"),
  journalController.createJournalEntry,
);

router.post(
  "/bulk_create/:id/entries/bulk",
  roleMiddleware("ADMIN"),
  journalController.bulkCreateEntries,
);

export default router;
