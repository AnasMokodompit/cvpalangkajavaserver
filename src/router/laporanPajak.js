const express = require("express");
const router = express();
const { getPenjualanWeb, getLangsungOrCustom, getPengadaanMeubel } = require("../controller/controller.laporanPajak");

router.get(`/penjualanWeb`, getPenjualanWeb);
router.get(`/penjualanLangsung`, getLangsungOrCustom);
router.get(`/penjualanMeubel`, getPengadaanMeubel);

module.exports = router;
