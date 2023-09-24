const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Categories = require("./Data/categories.json");
const Producs = require("./Data/products.json");
const Product_images = require("./Data/product_image.json");
const Roles = require("./Data/role.json");
const Users = require("./Data/user.json");
const review_product = require("./Data/review_product.json");
const JenisTransaksi = require("./Data/jenis_transaksi.json");
const TipeAkunTransaksi = require("./Data/tipe_akun_transaksi.json");
const NamaAkunTransaksi = require("./Data/nama_akun_transaksi.json");
const NamaAkunTransaksiDalamJenisTransaksi = require("./Data/nama_akun_transaksi_dalam_jenis_transaksi.json");
const BahanBakuProduk = require("./Data/bahan_baku_produk.json");
const BahanBaku = require("./Data/bahan_baku.json");
const PersediaanBahanBaku = require("./Data/persediaan-bahan-baku.json");

async function main() {
  // Categories
  await prisma.Categories.createMany({
    data: Categories,
    skipDuplicates: true,
  });

  await prisma.Products.createMany({
    data: Producs,
    skipDuplicates: true,
  });

  await prisma.Product_images.createMany({
    data: Product_images,
    skipDuplicates: true,
  });

  await prisma.roles.createMany({
    data: Roles,
    skipDuplicates: true,
  });

  await prisma.users.createMany({
    data: Users,
    skipDuplicates: true,
  });

  await prisma.reviewevUserProduct.createMany({
    data: review_product,
    skipDuplicates: true,
  });

  await prisma.jenisTransaksi.createMany({
    data: JenisTransaksi,
    skipDuplicates: true,
  });

  await prisma.tipeAkunTransaksi.createMany({
    data: TipeAkunTransaksi,
    skipDuplicates: true,
  });

  await prisma.namaAkunTransaksi.createMany({
    data: NamaAkunTransaksi,
    skipDuplicates: true,
  });

  await prisma.NamaAkunTransaksiDalamJenisTransaksi.createMany({
    data: NamaAkunTransaksiDalamJenisTransaksi,
    skipDuplicates: true,
  });

  await prisma.bahanBaku.createMany({
    data: BahanBaku,
    skipDuplicates: true,
  });

  await prisma.persediaanBahanBaku.createMany({
    data: PersediaanBahanBaku,
    skipDuplicates: true,
  });

  await prisma.bahanBakuProduk.createMany({
    data: BahanBakuProduk,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(`Error : ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    console.log(`Berhasil Sedding Database`);
    prisma.$disconnect();
  });
