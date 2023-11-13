-- DropForeignKey
ALTER TABLE `saldoakuntransaksi` DROP FOREIGN KEY `SaldoAkunTransaksi_id_transaksi_fkey`;

-- AlterTable
ALTER TABLE `saldoakuntransaksi` MODIFY `id_transaksi` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SaldoAkunTransaksi` ADD CONSTRAINT `SaldoAkunTransaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
