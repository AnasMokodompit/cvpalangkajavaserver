-- AlterTable
ALTER TABLE `saldoakuntransaksi` ADD COLUMN `id_tutup_buku` INTEGER NULL;

-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `id_tutup_buku` INTEGER NULL;

-- CreateTable
CREATE TABLE `TutupBuku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_tutup_buku_fkey` FOREIGN KEY (`id_tutup_buku`) REFERENCES `TutupBuku`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaldoAkunTransaksi` ADD CONSTRAINT `SaldoAkunTransaksi_id_tutup_buku_fkey` FOREIGN KEY (`id_tutup_buku`) REFERENCES `TutupBuku`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
