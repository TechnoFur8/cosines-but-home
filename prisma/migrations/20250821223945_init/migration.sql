/*
  Warnings:

  - Added the required column `img` to the `CartProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CartProduct" ADD COLUMN     "img" TEXT NOT NULL;
