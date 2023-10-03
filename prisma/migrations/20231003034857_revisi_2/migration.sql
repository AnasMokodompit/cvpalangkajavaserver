-- AlterTable
ALTER TABLE `namaakuntransaksi` ADD COLUMN `id_keterangan` INTEGER NULL;

-- CreateTable
CREATE TABLE `KeteranganNamaAkunTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saldoNormal` VARCHAR(191) NOT NULL,
    `post` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NamaAkunTransaksi` ADD CONSTRAINT `NamaAkunTransaksi_id_keterangan_fkey` FOREIGN KEY (`id_keterangan`) REFERENCES `KeteranganNamaAkunTransaksi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
