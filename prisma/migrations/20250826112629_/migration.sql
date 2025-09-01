-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "catalogId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Catalog" (
    "id" SERIAL NOT NULL,
    "img" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Catalog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "public"."Catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
