-- AlterTable
ALTER TABLE `product_orders` ADD COLUMN `jumlah_meter` INTEGER NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `IsPermeter` BOOLEAN NOT NULL DEFAULT false;
