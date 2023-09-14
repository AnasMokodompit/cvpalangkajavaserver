/*
  Warnings:

  - Added the required column `picture_bukti_bayar` to the `Product_Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture_bukti_bayar_id` to the `Product_Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product_orders` ADD COLUMN `picture_bukti_bayar` VARCHAR(191) NOT NULL,
    ADD COLUMN `picture_bukti_bayar_id` VARCHAR(191) NOT NULL;
