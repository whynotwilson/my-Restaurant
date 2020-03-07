const express = require('express')
const router = express.Router()
const Todo = require('../models/restaurant')
const { authenticated } = require('../config/auth')

// 首頁
router.get('/', authenticated, (req, res) => {
  return res.redirect('/restaurants')
})

module.exports = router
