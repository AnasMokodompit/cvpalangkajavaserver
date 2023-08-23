/*
  Warnings:

  - Added the required column `Price` to the `Product_Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah` to the `Product_Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product_orders` ADD COLUMN `Price` INTEGER NOT NULL,
    ADD COLUMN `jumlah` INTEGER NOT NULL;
