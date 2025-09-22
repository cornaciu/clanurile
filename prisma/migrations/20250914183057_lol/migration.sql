/*
  Warnings:

  - The primary key for the `UserItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserItem` table. All the data in the column will be lost.
  - Added the required column `type` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."UserItem_userId_itemId_key";

-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserItem" DROP CONSTRAINT "UserItem_pkey",
DROP COLUMN "id",
ALTER COLUMN "quantity" SET DEFAULT 0,
ADD CONSTRAINT "UserItem_pkey" PRIMARY KEY ("userId", "itemId");
