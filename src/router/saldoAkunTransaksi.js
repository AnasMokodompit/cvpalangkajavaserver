const express = require("express");
const router = express();
const { getNamaAkunByTipe, GetAllRekapJurnal,  getAllSaldoAwal, getByIdSaldowAwal, updateSaldoAwal} = require("../controller/controller.saldoAkunTransaksi");

router.get(`/`, getNamaAkunByTipe);
router.get(`/rekapJurnal`, GetAllRekapJurnal);

router.get('/saldoAwal', getAllSaldoAwal)
router.get('/saldoAwal/:id', getByIdSaldowAwal)
router.patch('/saldoAwal/:id', updateSaldoAwal)

module.exports = router;