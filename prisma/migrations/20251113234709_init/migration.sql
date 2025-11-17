/*
  Warnings:

  - You are about to drop the column `ratingId` on the `Rating` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Rating_ratingId_key";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "ratingId";
