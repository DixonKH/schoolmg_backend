-- CreateIndex
CREATE INDEX "AttendanceEntry_studentId_idx" ON "AttendanceEntry"("studentId");

-- CreateIndex
CREATE INDEX "Journal_classId_subjectId_idx" ON "Journal"("classId", "subjectId");

-- CreateIndex
CREATE INDEX "JournalEntry_studentId_idx" ON "JournalEntry"("studentId");

-- CreateIndex
CREATE INDEX "Payment_studentId_idx" ON "Payment"("studentId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Student_classId_idx" ON "Student"("classId");

-- CreateIndex
CREATE INDEX "Student_status_idx" ON "Student"("status");
