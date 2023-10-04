const express = require("express");
const router = express();
const authJWT = require("../middleware/passport-jwt");
const {
  getAllProductOrder,
  getAllProductOrderByIdOrder,
  getAllProductOrderById,
  updatbyIdProductOrder,
  getAllProdukOrderDiterimaById,
  updateProdukOrderDiterimaById
} = require("../controller/controller.productOrder");
const { upload, MulterError } = require("../middleware/multer");
const validate = require("../middleware/expressValidator");

router.get(`/`, authJWT, authJWT, getAllProductOrder);
router.patch(`/:id`, authJWT, updatbyIdProductOrder);
router.get(`/customers`, authJWT, getAllProductOrderByIdOrder);
router.get(`/customers/:id`, authJWT, getAllProductOrderById);

router.get('/ProdukOrderTerima', authJWT, getAllProdukOrderDiterimaById)
router.patch('/ProdukOrderTerima/:id', authJWT, updateProdukOrderDiterimaById)


module.exports = router;
