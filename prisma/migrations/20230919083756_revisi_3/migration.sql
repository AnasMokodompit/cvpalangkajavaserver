/*
  Warnings:

  - You are about to drop the column `IsPembayaran` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `IsPembayaran`,
    ADD COLUMN `IsPembayaranDP` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `IsPembayaranLunas` BOOLEAN NULL DEFAULT false;
