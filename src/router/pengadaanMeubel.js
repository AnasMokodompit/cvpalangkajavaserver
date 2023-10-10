const express = require("express");
const router = express();
const { createPengadaanMeubel } = require("../controller/controller.pengadaanMeubel");

router.post(`/`, createPengadaanMeubel);

module.exports = router;