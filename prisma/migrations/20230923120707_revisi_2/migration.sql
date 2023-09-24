-- DropForeignKey
ALTER TABLE `namaakuntransaksi` DROP FOREIGN KEY `NamaAkunTransaksi_id_tipe_akun_transaksi_fkey`;

-- AlterTable
ALTER TABLE `namaakuntransaksi` MODIFY `id_tipe_akun_transaksi` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `NamaAkunTransaksi` ADD CONSTRAINT `NamaAkunTransaksi_id_tipe_akun_transaksi_fkey` FOREIGN KEY (`id_tipe_akun_transaksi`) REFERENCES `TipeAkunTransaksi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
