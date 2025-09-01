/*
  Warnings:

  - You are about to drop the column `img` on the `CartProduct` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CartProduct` table. All the data in the column will be lost.
  - Added the required column `size` to the `CartProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."CartProduct_name_key";

-- AlterTable
ALTER TABLE "public"."CartProduct" DROP COLUMN "img",
DROP COLUMN "name",
ADD COLUMN     "size" TEXT NOT NULL;
