/*
  Warnings:

  - A unique constraint covering the columns `[studentId,subjectId,date]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Grade_studentId_subjectId_date_key" ON "Grade"("studentId", "subjectId", "date");
