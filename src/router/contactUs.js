const express = require("express");
const router = express();
const { getAllContactUs, createContatUs, deleteContatUs} = require("../controller/controller.contactUs");

router.get(`/`, getAllContactUs);
router.post(`/`, createContatUs);
router.delete(`/:id`, deleteContatUs);

module.exports = router;
