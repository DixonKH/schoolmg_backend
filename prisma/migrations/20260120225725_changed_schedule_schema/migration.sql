/*
  Warnings:

  - A unique constraint covering the columns `[classId,dayOfWeek,startTime,endTime]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `room` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dayOfWeek` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "room" TEXT NOT NULL,
ADD COLUMN     "subjectId" TEXT NOT NULL,
ADD COLUMN     "teacherId" TEXT NOT NULL,
DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "WeekDay" NOT NULL;

-- CreateIndex
CREATE INDEX "Schedule_teacherId_dayOfWeek_idx" ON "Schedule"("teacherId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_classId_dayOfWeek_startTime_endTime_key" ON "Schedule"("classId", "dayOfWeek", "startTime", "endTime");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
