const express = require('express')
const router = express()
const {createOrder, getAllOrder, deleteOrder} = require('../controller/controller.order')

router.get(`/`, getAllOrder)
// router.get(`/:id`, getByIdProduct)
router.post(`/`, createOrder)
router.delete('/:id', deleteOrder)


module.exports = router