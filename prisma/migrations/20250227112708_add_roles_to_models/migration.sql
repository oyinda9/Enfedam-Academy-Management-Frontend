-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'USER');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'TEACHER';
