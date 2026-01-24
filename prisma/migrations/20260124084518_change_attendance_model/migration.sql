/*
  Warnings:

  - You are about to drop the column `classId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `present` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scheduleId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_classId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_subjectId_fkey";

-- DropIndex
DROP INDEX "Attendance_date_studentId_subjectId_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "classId",
DROP COLUMN "present",
DROP COLUMN "studentId",
DROP COLUMN "subjectId",
ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AttendanceEntry" (
    "id" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "AttendanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceEntry_attendanceId_studentId_key" ON "AttendanceEntry"("attendanceId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_scheduleId_date_key" ON "Attendance"("scheduleId", "date");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEntry" ADD CONSTRAINT "AttendanceEntry_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEntry" ADD CONSTRAINT "AttendanceEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
