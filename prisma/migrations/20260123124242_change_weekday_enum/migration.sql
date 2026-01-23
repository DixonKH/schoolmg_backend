/*
  Warnings:

  - The values [MON,TUE,WED,THU,FRI,SAT] on the enum `WeekDay` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WeekDay_new" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satuday', 'Sunday');
ALTER TABLE "Schedule" ALTER COLUMN "dayOfWeek" TYPE "WeekDay_new" USING ("dayOfWeek"::text::"WeekDay_new");
ALTER TYPE "WeekDay" RENAME TO "WeekDay_old";
ALTER TYPE "WeekDay_new" RENAME TO "WeekDay";
DROP TYPE "public"."WeekDay_old";
COMMIT;
