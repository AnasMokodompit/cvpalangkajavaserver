/*
  Warnings:

  - You are about to drop the column `id_keterangan` on the `namaakuntransaksi` table. All the data in the column will be lost.
  - You are about to drop the `keterangannamaakuntransaksi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `namaakuntransaksi` DROP FOREIGN KEY `NamaAkunTransaksi_id_keterangan_fkey`;

-- AlterTable
ALTER TABLE `namaakuntransaksi` DROP COLUMN `id_keterangan`;

-- DropTable
DROP TABLE `keterangannamaakuntransaksi`;
