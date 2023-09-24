const express = require("express");
const router = express();
const { getAllContactUs, createContatUs } = require("../controller/controller.contactUs");

router.get(`/`, getAllContactUs);
router.post(`/`, createContatUs);

module.exports = router;
