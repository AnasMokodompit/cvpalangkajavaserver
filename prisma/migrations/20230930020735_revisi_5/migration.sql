/*
  Warnings:

  - Added the required column `kode_nama_akun_transaksi` to the `SaldoAkunTransaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `saldoakuntransaksi` ADD COLUMN `kode_nama_akun_transaksi` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `SaldoAkunTransaksi` ADD CONSTRAINT `SaldoAkunTransaksi_kode_nama_akun_transaksi_fkey` FOREIGN KEY (`kode_nama_akun_transaksi`) REFERENCES `NamaAkunTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
