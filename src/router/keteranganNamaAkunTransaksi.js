const express = require("express");
const router = express();
const { getAllketeranganNamaAkunTransaksi} = require("../controller/controller.keteranganNamaAkunTransaksi");

router.get(`/`, getAllketeranganNamaAkunTransaksi);

module.exports = router;
