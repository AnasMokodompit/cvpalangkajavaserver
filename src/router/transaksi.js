const express = require("express");
const router = express();
const {
  listTransaksi,
  postTransaksi,
} = require("../controller/controller.transaksi");

router.get(`/`, listTransaksi);
router.post(`/`, postTransaksi);

module.exports = router;
