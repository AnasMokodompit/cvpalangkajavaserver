-- CreateTable
CREATE TABLE `SaldoAkunTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saldo` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_akun_transaksi` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SaldoAkunTransaksi` ADD CONSTRAINT `SaldoAkunTransaksi_id_akun_transaksi_fkey` FOREIGN KEY (`id_akun_transaksi`) REFERENCES `AkunTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
