const express = require("express");
const router = express();
const {tutupBuku, getNamaAkunByTipe, GetLaporanLabaRugi, GetAllRekapJurnal,  getAllSaldoAwal, getByIdSaldowAwal, updateSaldoAwal} = require("../controller/controller.saldoAkunTransaksi");

router.get(`/`, getNamaAkunByTipe);
router.get('/labaRugi', GetLaporanLabaRugi)
router.get(`/rekapJurnal`, GetAllRekapJurnal);
router.patch('/tutupBuku', tutupBuku)

router.get('/saldoAwal', getAllSaldoAwal)
router.get('/saldoAwal/:id', getByIdSaldowAwal)
router.patch('/saldoAwal/:id', updateSaldoAwal)

module.exports = router;