/*
  Warnings:

  - Added the required column `id_user` to the `Product_Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product_orders` ADD COLUMN `id_user` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product_Orders` ADD CONSTRAINT `Product_Orders_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
