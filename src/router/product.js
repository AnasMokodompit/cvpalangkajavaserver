const express = require('express')
const router = express()
const {getAllProduct, getByIdProduct, createProduct} = require('../controller/controller.product')

router.get(`/`, getAllProduct)
router.get(`/:id`, getByIdProduct)
router.post(`/`, createProduct)


module.exports = router