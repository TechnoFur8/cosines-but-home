/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favoriteId` to the `FavoriteProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Favorite" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."FavoriteProduct" ADD COLUMN     "favoriteId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_sessionId_key" ON "public"."Favorite"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."FavoriteProduct" ADD CONSTRAINT "FavoriteProduct_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "public"."Favorite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
