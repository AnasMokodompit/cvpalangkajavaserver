/*
  Warnings:

  - Added the required column `status` to the `Product_Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product_orders` ADD COLUMN `status` INTEGER NOT NULL;
