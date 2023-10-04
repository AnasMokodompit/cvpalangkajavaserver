const express = require("express");
const router = express();
const { createRevieProduk} = require("../controller/controller.reviewProduk");

router.post(`/`, createRevieProduk);

module.exports = router;
