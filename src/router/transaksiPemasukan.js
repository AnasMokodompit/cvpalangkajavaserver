const express = require('express')
const router = express()
const {createTransaksiPemasukan, getTransaksiPemasukan, getTransaksiPemasukanById} = require('../controller/controller.transaksiPemasukan')
const authJWT = require('../middleware/passport-jwt')

router.post('/', authJWT, createTransaksiPemasukan)
router.get(`/:id`, authJWT, getTransaksiPemasukanById)
router.get(`/`, authJWT, getTransaksiPemasukan)


module.exports = router