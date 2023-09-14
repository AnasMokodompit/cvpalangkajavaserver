const express = require('express')
const router = express()

const product = require('./product')
const category = require('./category')
const order = require('./order')
const user = require('./user')
const contactUs = require('./contactUs')
const productOrder = require('./productOrder')

router.use(`${process.env.URL_ROUTER_USER}`, user)
router.use(`${process.env.URL_ROUTER_PRODUCT}`, product)
router.use(`${process.env.URL_ROUTER_CATEGORIES}`, category)
router.use(`${process.env.URL_ROUTER_ORDER}`, order)
router.use(`${process.env.URL_ROUTER_CONTACTUS}`, contactUs)
router.use(`${process.env.URL_ROUTER_PRODUCT_ORDER}`, productOrder)


router.all('*',(req,res) => {
    res.status(404).json({message :"Sorry, page not found"});
});


module.exports = router