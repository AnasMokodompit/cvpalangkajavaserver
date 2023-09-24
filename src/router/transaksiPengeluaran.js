const express = require("express");
const router = express();
const {
  createTransaksiPengeluaran,
  getAllTansaksiPengeluaran,
} = require("../controller/controller.transaksiPengeluaran");
const authJWT = require("../middleware/passport-jwt");

router.post("/", authJWT, createTransaksiPengeluaran);
router.get(`/`, authJWT, getAllTansaksiPengeluaran);

module.exports = router;
