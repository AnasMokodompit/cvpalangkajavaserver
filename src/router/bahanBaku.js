const express = require("express");
const router = express();
const { getAllBahanBaku, getByIdBahanBaku } = require("../controller/controller.bahanBaku");
const authJWT = require("../middleware/passport-jwt");

router.get(`/`, authJWT, getAllBahanBaku);
router.get("/:id", authJWT, getByIdBahanBaku);

module.exports = router;
