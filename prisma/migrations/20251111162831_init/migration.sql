/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Favorite` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Cart_sessionId_key";

-- DropIndex
DROP INDEX "public"."Favorite_sessionId_key";

-- AlterTable
ALTER TABLE "public"."Cart" DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "public"."Favorite" DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT NOT NULL;
