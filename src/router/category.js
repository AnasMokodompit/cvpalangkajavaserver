const express = require('express')
const router = express()
const {getAllCategories} = require('../controller/controller.category')

router.get(`/`, getAllCategories)


module.exports = router