-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nomor_hp` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `rolesId` INTEGER NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KomentarKeKontakKami` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `pesan` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewevUserProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `products_id` INTEGER NOT NULL,
    `bintang` INTEGER NOT NULL,
    `komentar` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `ukuran` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `Deskripsi_produk` VARCHAR(191) NOT NULL,
    `categoriesId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url_image` VARCHAR(191) NOT NULL,
    `product_image_id` VARCHAR(191) NULL,
    `product_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pemesan` VARCHAR(191) NOT NULL,
    `id_user` INTEGER NOT NULL,
    `no_hp` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `Price` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `IsPembayaranDP` BOOLEAN NULL DEFAULT false,
    `IsPembayaranLunas` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product_Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_orders` INTEGER NOT NULL,
    `id_product` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `Price` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BuktiBayar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statusTransaksi` BOOLEAN NULL,
    `picture_bukti_bayar` VARCHAR(191) NULL,
    `picture_bukti_bayar_id` VARCHAR(191) NULL,
    `id_orders` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NamaAkunTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tipe_akun_transaksi` INTEGER NULL,
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

-- CreateTable
CREATE TABLE `Transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_jenis_transaksi` INTEGER NOT NULL,
    `id_nama_akun_transaksi` INTEGER NOT NULL,
    `keterangan` TEXT NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Saldo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total_uang` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BahanBakuProduk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_produk` INTEGER NOT NULL,
    `id_bahan_baku` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BahanBaku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersediaanBahanBaku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_bahan_baku` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_rolesId_fkey` FOREIGN KEY (`rolesId`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewevUserProduct` ADD CONSTRAINT `ReviewevUserProduct_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewevUserProduct` ADD CONSTRAINT `ReviewevUserProduct_products_id_fkey` FOREIGN KEY (`products_id`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_categoriesId_fkey` FOREIGN KEY (`categoriesId`) REFERENCES `Categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_images` ADD CONSTRAINT `Product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_Orders` ADD CONSTRAINT `Product_Orders_id_orders_fkey` FOREIGN KEY (`id_orders`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_Orders` ADD CONSTRAINT `Product_Orders_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_Orders` ADD CONSTRAINT `Product_Orders_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuktiBayar` ADD CONSTRAINT `BuktiBayar_id_orders_fkey` FOREIGN KEY (`id_orders`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NamaAkunTransaksi` ADD CONSTRAINT `NamaAkunTransaksi_id_tipe_akun_transaksi_fkey` FOREIGN KEY (`id_tipe_akun_transaksi`) REFERENCES `TipeAkunTransaksi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NamaAkunTransaksiDalamJenisTransaksi` ADD CONSTRAINT `NamaAkunTransaksiDalamJenisTransaksi_id_jenis_transaksi_fkey` FOREIGN KEY (`id_jenis_transaksi`) REFERENCES `JenisTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NamaAkunTransaksiDalamJenisTransaksi` ADD CONSTRAINT `NamaAkunTransaksiDalamJenisTransaksi_id_nama_akun_transaksi_fkey` FOREIGN KEY (`id_nama_akun_transaksi`) REFERENCES `NamaAkunTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_jenis_transaksi_fkey` FOREIGN KEY (`id_jenis_transaksi`) REFERENCES `JenisTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_nama_akun_transaksi_fkey` FOREIGN KEY (`id_nama_akun_transaksi`) REFERENCES `NamaAkunTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BahanBakuProduk` ADD CONSTRAINT `BahanBakuProduk_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BahanBakuProduk` ADD CONSTRAINT `BahanBakuProduk_id_bahan_baku_fkey` FOREIGN KEY (`id_bahan_baku`) REFERENCES `BahanBaku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersediaanBahanBaku` ADD CONSTRAINT `PersediaanBahanBaku_id_bahan_baku_fkey` FOREIGN KEY (`id_bahan_baku`) REFERENCES `BahanBaku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
