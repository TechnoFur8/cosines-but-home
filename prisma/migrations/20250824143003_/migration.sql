/*
  Warnings:

  - Added the required column `size` to the `FavoriteProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."FavoriteProduct" ADD COLUMN     "size" TEXT NOT NULL;
