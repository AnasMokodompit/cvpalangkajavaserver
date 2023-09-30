-- DropForeignKey
ALTER TABLE `saldoakuntransaksi` DROP FOREIGN KEY `SaldoAkunTransaksi_kode_nama_akun_transaksi_fkey`;

-- AlterTable
ALTER TABLE `saldoakuntransaksi` MODIFY `kode_nama_akun_transaksi` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `SaldoAkunTransaksi` ADD CONSTRAINT `SaldoAkunTransaksi_kode_nama_akun_transaksi_fkey` FOREIGN KEY (`kode_nama_akun_transaksi`) REFERENCES `NamaAkunTransaksi`(`kode`) ON DELETE RESTRICT ON UPDATE CASCADE;
