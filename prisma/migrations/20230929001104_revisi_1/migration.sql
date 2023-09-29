/*
  Warnings:

  - Added the required column `id_nama_akun_jenis_transaksi` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `akuntransaksi` DROP FOREIGN KEY `AkunTransaksi_id_kategori_akun_fkey`;

-- AlterTable
ALTER TABLE `akuntransaksi` MODIFY `id_kategori_akun` INTEGER NULL;

-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `id_nama_akun_jenis_transaksi` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_nama_akun_jenis_transaksi_fkey` FOREIGN KEY (`id_nama_akun_jenis_transaksi`) REFERENCES `NamaAkunTransaksiDalamJenisTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AkunTransaksi` ADD CONSTRAINT `AkunTransaksi_id_kategori_akun_fkey` FOREIGN KEY (`id_kategori_akun`) REFERENCES `KategoriAkun`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
