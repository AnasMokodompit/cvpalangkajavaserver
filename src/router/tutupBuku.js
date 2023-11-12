const express = require("express");
const router = express();
const { getAllTutupBuku } = require("../controller/controller.tutupBuku");

router.get(`/`, getAllTutupBuku);

module.exports = router;
