const express = require("express");
const router = express();
const {
  listJenisTransaksi,
  listNamaAkunTransaksiByJenisTransaksi,
} = require("../controller/controller.jenistransaksi");

router.get(`/`, listJenisTransaksi);
router.get(`/:id/namaAkunTransaksi`, listNamaAkunTransaksiByJenisTransaksi);

module.exports = router;
