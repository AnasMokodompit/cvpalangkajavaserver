const express = require("express");
const router = express();

const product = require("./product");
const category = require("./category");
const order = require("./order");
const user = require("./user");
const contactUs = require("./contactUs");
const productOrder = require("./productOrder");
const transaksiPemasukan = require("./transaksiPemasukan");
const transaksiPengeluaran = require("./transaksiPengeluaran");
const buktiBayar = require("./buktiBayar");
const jenisTransaksi = require("./jenistransaksi");
const transaksi = require("./transaksi");
const bahanBaku = require("./bahanBaku");
const persediaanBahanBaku = require("./persediaanBahanBaku");
const namaAkunTransaksi = require("./namaAkunTransaksi");
const bahanBakuProduk = require('./bahanBakuProduk')
const pesananCustom = require('./pesananCustom')
const saldoAkunTransaksi = require('./saldoAkunTransaksi')
const reviewProduk = require('./reviewProduk')

router.use(`${process.env.URL_ROUTER_USER}`, user);
router.use(`${process.env.URL_ROUTER_PRODUCT}`, product);
router.use(`${process.env.URL_ROUTER_CATEGORIES}`, category);
router.use(`${process.env.URL_ROUTER_ORDER}`, order);
router.use(`${process.env.URL_ROUTER_CONTACTUS}`, contactUs);
router.use(`${process.env.URL_ROUTER_PRODUCT_ORDER}`, productOrder);
router.use(`${process.env.URL_ROUTER_TRANSAKSI_PEMASUKAN}`, transaksiPemasukan);
router.use(`${process.env.URL_ROUTER_TRANSAKSI_PENGELUARAN}`, transaksiPengeluaran);
router.use(`${process.env.URL_ROUTER_BUKTI_BAYAR}`, buktiBayar);
router.use(`${process.env.URL_ROUTER_JENIS_TRANSAKSI}`, jenisTransaksi);
router.use(`${process.env.URL_ROUTER_TRANSAKSI}`, transaksi);
router.use(`${process.env.URL_ROUTER_BAHAN_BAKU}`, bahanBaku);
router.use(`${process.env.URL_ROUTER_PERSEDIAAN_BAHAN_BAKU}`, persediaanBahanBaku);
router.use(`${process.env.URL_ROUTER_BAHAN_BAKU_PRODUK}`, bahanBakuProduk);
router.use(`${process.env.URL_ROUTER_NAMA_AKUN_TRANSAKSI}`, namaAkunTransaksi);
router.use(`${process.env.URL_ROUTER_PESANAN_CUSTOM}`, pesananCustom);
router.use(`${process.env.URL_ROUTER_SALDO_AKUN_TRANSAKSI}`, saldoAkunTransaksi);
router.use(`${process.env.URL_ROUTER_REVIEW_PRODUK}`, reviewProduk);

router.all("*", (req, res) => {
  res.status(404).json({ message: "Sorry, page not found" });
});

module.exports = router;
