const express = require("express");
const router = express();
const {
  createJenisTransaksi,
  deleteJenisTransaksi,
  listJenisTransaksi,
  listNamaAkunTransaksiByJenisTransaksi,
  updateJenisTransaksi,
} = require("../controller/controller.jenistransaksi");

router.get(`/`, listJenisTransaksi);
router.post(`/`, createJenisTransaksi);
router.delete(`/:id`, deleteJenisTransaksi);
router.patch(`/:id`, updateJenisTransaksi);
router.get(`/:id/namaAkunTransaksi`, listNamaAkunTransaksiByJenisTransaksi);

module.exports = router;
