/*
  Warnings:

  - A unique constraint covering the columns `[ratingId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_ratingId_key" ON "public"."Rating"("ratingId");
