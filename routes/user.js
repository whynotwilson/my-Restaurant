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
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err
    if (user) {
      passport.authenticate('local', { successRedirect: '/' })(req, res, next) // question
    } else {
      req.flash('warning_msg', info.message)
      return res.redirect('/users/login')
    }
  })(req, res, next)
})

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊檢查
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body

  // 錯誤訊息提示
  const errors = []

  if (password !== password2) {
    errors.push({ message: '二次密碼不一致' })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    // 尋找 email 是否已被註冊
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ message: 'Email 已註冊' })
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          name,
          email,
          password
        })

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser
              .save()
              .then(user => {
                res.redirect('/')
              })
              .catch(err => console.log(err))
          })
        })
      }
    })
  }
})

// 登出
router.get('/logout', (req, res) => {
  req.logout() // 執行 Passport 提供的方法清除 session
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/users/login')
})

module.exports = router
