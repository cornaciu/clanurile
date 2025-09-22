-- AlterTable
ALTER TABLE "public"."Quest" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "time" INTEGER;
