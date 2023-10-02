const express = require("express");
const router = express();
const { getNamaAkunByTipe, GetAllRekapJurnal } = require("../controller/controller.saldoAkunTransaksi");

router.get(`/`, getNamaAkunByTipe);
router.get(`/rekapJurnal`, GetAllRekapJurnal);

module.exports = router;