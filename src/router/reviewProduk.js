const express = require("express");
const router = express();
const { createRevieProduk} = require("../controller/controller.reviewProduk");
const authJWT = require("../middleware/passport-jwt");

router.post(`/`, authJWT, createRevieProduk);

module.exports = router;
