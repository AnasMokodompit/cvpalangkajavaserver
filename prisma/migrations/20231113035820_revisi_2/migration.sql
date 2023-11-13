/*
  Warnings:

  - Added the required column `id_transaksi` to the `SaldoAkunTransaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `saldoakuntransaksi` ADD COLUMN `id_transaksi` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `SaldoAkunTransaksi` ADD CONSTRAINT `SaldoAkunTransaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
