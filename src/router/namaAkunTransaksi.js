const express = require("express");
const router = express();
const {
  createNamaAkunTransaksi,
  deleteNamaAkunTransaksi,
  listNamaAkunTransaksi,
  updateNamaAkunTransaksi,
} = require("../controller/controller.namaAkunTransaksi");

router.get(`/`, listNamaAkunTransaksi);
router.post(`/`, createNamaAkunTransaksi);
router.delete(`/:id`, deleteNamaAkunTransaksi);
router.patch(`/:id`, updateNamaAkunTransaksi);

module.exports = router;
