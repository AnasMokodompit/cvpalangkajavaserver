const express = require("express");
const router = express();
const { getAlltipeAkunTransaksi} = require("../controller/controller.tipeAkunTransaksi");

router.get(`/`, getAlltipeAkunTransaksi);

module.exports = router;
