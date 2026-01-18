-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "address" TEXT,
ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "address" TEXT,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "birthDate" TEXT,
ADD COLUMN     "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE';
