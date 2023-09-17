const express = require('express')
const router = express()

const product = require('./product')
const category = require('./category')
const order = require('./order')
const user = require('./user')
const contactUs = require('./contactUs')
const productOrder = require('./productOrder')
const transaksiPemasukan = require('./transaksiPemasukan')
const transaksiPengeluaran = require('./transaksiPengeluaran')
const buktiBayar = require('./buktiBayar')
const jenisTransaksi = require('./jenistransaksi')
const transaksi = require("./transaksi");


router.use(`${process.env.URL_ROUTER_USER}`, user)
router.use(`${process.env.URL_ROUTER_PRODUCT}`, product)
router.use(`${process.env.URL_ROUTER_CATEGORIES}`, category)
router.use(`${process.env.URL_ROUTER_ORDER}`, order)
router.use(`${process.env.URL_ROUTER_CONTACTUS}`, contactUs)
router.use(`${process.env.URL_ROUTER_PRODUCT_ORDER}`, productOrder)
router.use(`${process.env.URL_ROUTER_TRANSAKSI_PEMASUKAN}`, transaksiPemasukan)
router.use(`${process.env.URL_ROUTER_TRANSAKSI_PENGELUARAN}`, transaksiPengeluaran)
router.use(`${process.env.URL_ROUTER_BUKTI_BAYAR}`, buktiBayar)
router.use(`${process.env.URL_ROUTER_JENIS_TRANSAKSI}`, jenisTransaksi);
router.use(`${process.env.URL_ROUTER_TRANSAKSI}`, transaksi);



router.all('*',(req,res) => {
    res.status(404).json({message :"Sorry, page not found"});
});


module.exports = router