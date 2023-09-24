const express = require("express");
const router = express();
const authJWT = require("../middleware/passport-jwt");
const { createBuktiBayar } = require("../controller/controller.buktiBayar");
const { upload, MulterError } = require("../middleware/multer");
const validate = require("../middleware/expressValidator");

router.post(
  `/`,
  authJWT,
  upload.single("gambarBuktiBayar"),
  MulterError,
  validate,
  createBuktiBayar,
);

module.exports = router;
