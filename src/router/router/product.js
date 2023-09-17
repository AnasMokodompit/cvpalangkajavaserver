const express = require('express')
const router = express()
const {getAllProduct, getByIdProduct, createProduct, updateProductById, deleteProductById} = require('../controller/controller.product')
const {upload, MulterError} = require('../middleware/multer')
const validate = require('../middleware/expressValidator')
const authJWT = require('..//middleware/passport-jwt')

router.get(`/`, getAllProduct)
router.get(`/:id`, getByIdProduct)
router.post(`/`, authJWT, upload.array('gambarProduct'), MulterError, validate, createProduct)
router.patch('/:id', authJWT, upload.array('gambarProduct'), MulterError, validate, updateProductById)
router.delete('/:id', authJWT, deleteProductById)


module.exports = router