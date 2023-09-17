const express = require('express')
const router = express()
const authJWT = require('../middleware/passport-jwt')
const {getAllProductOrder, getAllProductOrderByIdOrder, updatbyIdProductOrder} = require('../controller/controller.productOrder')
const {upload, MulterError} = require('../middleware/multer')
const validate = require('../middleware/expressValidator')

router.get(`/`,authJWT, authJWT, getAllProductOrder)
router.get(`/customers`, authJWT, getAllProductOrderByIdOrder)
router.patch(`/:id`, authJWT, updatbyIdProductOrder)


module.exports = router