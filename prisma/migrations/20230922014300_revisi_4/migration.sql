/*
  Warnings:

  - You are about to drop the `bahan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `bahan`;

-- CreateTable
CREATE TABLE `BahanBakuProduk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_produk` INTEGER NOT NULL,
    `id_bahan_baku` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BahanBaku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersediaanBahanBaku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_bahan_baku` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BahanBakuProduk` ADD CONSTRAINT `BahanBakuProduk_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BahanBakuProduk` ADD CONSTRAINT `BahanBakuProduk_id_bahan_baku_fkey` FOREIGN KEY (`id_bahan_baku`) REFERENCES `BahanBaku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersediaanBahanBaku` ADD CONSTRAINT `PersediaanBahanBaku_id_bahan_baku_fkey` FOREIGN KEY (`id_bahan_baku`) REFERENCES `BahanBaku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
