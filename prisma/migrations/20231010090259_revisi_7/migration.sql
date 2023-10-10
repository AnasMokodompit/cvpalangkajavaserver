/*
  Warnings:

  - A unique constraint covering the columns `[id_pajak_order]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `id_pajak_order` INTEGER NULL;

-- CreateTable
CREATE TABLE `Pajak_Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `DPP` INTEGER NOT NULL,
    `PPN` INTEGER NOT NULL,
    `PPh_22` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Orders_id_pajak_order_key` ON `Orders`(`id_pajak_order`);

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_id_pajak_order_fkey` FOREIGN KEY (`id_pajak_order`) REFERENCES `Pajak_Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
