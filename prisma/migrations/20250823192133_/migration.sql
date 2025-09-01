/*
  Warnings:

  - Added the required column `discount` to the `FavoriteProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `FavoriteProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `FavoriteProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `FavoriteProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."FavoriteProduct" ADD COLUMN     "discount" INTEGER NOT NULL,
ADD COLUMN     "img" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
