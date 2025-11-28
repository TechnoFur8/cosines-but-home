-- DropForeignKey
ALTER TABLE "CartProduct" DROP CONSTRAINT "CartProduct_cartId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteProduct" DROP CONSTRAINT "FavoriteProduct_favoriteId_fkey";

-- AddForeignKey
ALTER TABLE "CartProduct" ADD CONSTRAINT "CartProduct_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProduct" ADD CONSTRAINT "CartProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteProduct" ADD CONSTRAINT "FavoriteProduct_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteProduct" ADD CONSTRAINT "FavoriteProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
