const express = require("express");
const router = express();
const { listTransaksi, postTransaksi, updateTransaksi, deleteTransaksi } = require("../controller/controller.transaksi");

router.get(`/`, listTransaksi);
router.post(`/`, postTransaksi);
router.patch(`/:id`, updateTransaksi);
router.delete('/:id', deleteTransaksi)

module.exports = router;
