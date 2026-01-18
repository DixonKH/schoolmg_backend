/*
  Warnings:

  - The values [PARENT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `parents` on the `Student` table. All the data in the column will be lost.
  - Added the required column `parentName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentPhone` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `phoneNumber` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'TEACHER', 'ACCOUNTANT', 'STUDENT');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "parents",
ADD COLUMN     "parentName" TEXT NOT NULL,
ADD COLUMN     "parentPhone" TEXT NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;
