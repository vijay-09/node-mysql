const express = require('express')
const router = express.Router()

const firstController = require('../controllers/first.controller')

router.get('/products', firstController.getProducts)

module.exports = router