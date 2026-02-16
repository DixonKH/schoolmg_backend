/*
  Warnings:

  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `username` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_assignedToId_fkey";

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "avatarPublicId" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Lead";
