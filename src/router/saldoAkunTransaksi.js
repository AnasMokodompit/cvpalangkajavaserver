const express = require("express");
const router = express();
const { getNamaAkunByTipe } = require("../controller/controller.saldoAkunTransaksi");

router.get(`/`, getNamaAkunByTipe);

module.exports = router;