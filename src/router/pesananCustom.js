const express = require("express");
const router = express();
const { createPesananCustom } = require("../controller/controller.pesananCustom");
const authJWT = require("../middleware/passport-jwt");

router.post('/', createPesananCustom)

module.exports = router