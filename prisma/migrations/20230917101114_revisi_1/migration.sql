/*
  Warnings:

  - You are about to drop the column `created_at` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_transaksi` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `nama_akun` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the `akun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jurnal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kategoriakun` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_jenis_transaksi` to the `Transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_nama_akun_transaksi` to the `Transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah` to the `Transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keterangan` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `akun` DROP FOREIGN KEY `Akun_id_kategoriAkun_fkey`;

-- DropForeignKey
ALTER TABLE `akun` DROP FOREIGN KEY `Akun_id_transaksi_fkey`;

-- DropForeignKey
ALTER TABLE `jurnal` DROP FOREIGN KEY `Jurnal_kode_akun_fkey`;

-- DropIndex
DROP INDEX `Transaksi_jenis_transaksi_key` ON `transaksi`;

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `created_at`,
    DROP COLUMN `jenis_transaksi`,
    DROP COLUMN `nama_akun`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `id_jenis_transaksi` INTEGER NOT NULL,
    ADD COLUMN `id_nama_akun_transaksi` INTEGER NOT NULL,
    ADD COLUMN `jumlah` INTEGER NOT NULL,
    ADD COLUMN `keterangan` TEXT NOT NULL,
    ADD COLUMN `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `akun`;

-- DropTable
DROP TABLE `jurnal`;

-- DropTable
DROP TABLE `kategoriakun`;

-- CreateTable
CREATE TABLE `JenisTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NamaAkunTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tipe_akun_transaksi` INTEGER NOT NULL,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipeAkunTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NamaAkunTransaksiDalamJenisTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_jenis_transaksi` INTEGER NOT NULL,
    `id_nama_akun_transaksi` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NamaAkunTransaksi` ADD CONSTRAINT `NamaAkunTransaksi_id_tipe_akun_transaksi_fkey` FOREIGN KEY (`id_tipe_akun_transaksi`) REFERENCES `TipeAkunTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NamaAkunTransaksiDalamJenisTransaksi` ADD CONSTRAINT `NamaAkunTransaksiDalamJenisTransaksi_id_jenis_transaksi_fkey` FOREIGN KEY (`id_jenis_transaksi`) REFERENCES `JenisTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NamaAkunTransaksiDalamJenisTransaksi` ADD CONSTRAINT `NamaAkunTransaksiDalamJenisTransaksi_id_nama_akun_transaksi_fkey` FOREIGN KEY (`id_nama_akun_transaksi`) REFERENCES `NamaAkunTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_jenis_transaksi_fkey` FOREIGN KEY (`id_jenis_transaksi`) REFERENCES `JenisTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_nama_akun_transaksi_fkey` FOREIGN KEY (`id_nama_akun_transaksi`) REFERENCES `NamaAkunTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
