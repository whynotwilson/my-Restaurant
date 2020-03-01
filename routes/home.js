const express = require('express')
const router = express.Router()
const Todo = require('../models/restaurant')

// 首頁
router.get('/', (req, res) => {
  return res.redirect('/restaurants')
})

module.exports = router
