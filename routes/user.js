const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入檢查

// 註冊頁面

// 註冊檢查

// 登出

module.exports = router
