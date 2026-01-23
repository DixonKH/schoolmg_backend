import { Router } from "express";
import { JournalController } from "./journal.controller";
import { authMiddleware } from "../../middilwares/auth.middleware";
import { roleMiddleware } from "../../middilwares/role.middleware";
import { validateMiddleware } from "../../middilwares/validate.middleware";
import { getAllJournalSchema } from "../../schemas/journal.date.schema";

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

router.get(
  "/get_journalById/:id",
  roleMiddleware("TEACHER", "ADMIN"),
  journalController.getJournalById,
);

router.get(
  "/get_all_journal",
  roleMiddleware("TEACHER", "ADMIN"),
  validateMiddleware(getAllJournalSchema),
  journalController.getAllJournals,
);

router.post(
  "/bulk_create/:id/entries/bulk",
  roleMiddleware("ADMIN"),
  journalController.bulkCreateEntries,
);

router.post(
  "/bulk_update/:id/entries",
  roleMiddleware("TEACHER"),
  journalController.bulkUpdatedEntries,
);

export default router;
