const express = require("express");
const router = express();
const {createBahanBakuProduk, updateBahanBakuProdukById, deleteBahanBakuProdukById} = require("../controller/controller.bahanBakuProduk");
const authJWT = require("../middleware/passport-jwt");

router.post(`/`, authJWT, createBahanBakuProduk);
router.patch("/:id", authJWT, updateBahanBakuProdukById);
router.delete("/:id", authJWT, deleteBahanBakuProdukById);

module.exports = router;
