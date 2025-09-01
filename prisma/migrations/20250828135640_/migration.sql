/*
  Warnings:

  - You are about to drop the column `RatingId` on the `Rating` table. All the data in the column will be lost.
  - Added the required column `ratingId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Rating" DROP COLUMN "RatingId",
ADD COLUMN     "ratingId" TEXT NOT NULL;
