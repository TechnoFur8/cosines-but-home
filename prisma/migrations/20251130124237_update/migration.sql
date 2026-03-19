/*
  Warnings:

  - You are about to drop the column `userId` on the `Favorite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropIndex
DROP INDEX "Favorite_userId_key";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "userId",
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_sessionId_key" ON "Favorite"("sessionId");
