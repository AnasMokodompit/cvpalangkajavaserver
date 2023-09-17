const express = require('express')
const router = express()
const authJWT = require('../middleware/passport-jwt')
const {getAllProductOrder, updatbyIdProductOrder} = require('../controller/controller.productOrder')
const {upload, MulterError} = require('../middleware/multer')
const validate = require('../middleware/expressValidator')

router.get(`/`, authJWT, getAllProductOrder)
router.patch(`/:id`, authJWT, upload.single('gambarBuktiBayar'), MulterError, validate, updatbyIdProductOrder)


module.exports = router