const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(session({
  secret: 'ALPHA camp my-Restaurant', // 定義一個字串做為私鑰
  resave: false,
  saveUninitialized: true // 強制將未初始化的 session 存回 session store
}))

if (process.env.NODE_ENV !== 'production') { // 如果不是 production 模式
  require('dotenv').config() // 使用 dotenv 讀取 .env 檔案
}

// 設定靜態檔案
app.use(express.static('public'))

// 資料庫連線
mongoose.connect('mongodb://localhost/restaurant', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

// 資料庫連線後，透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongoDB errer')
})

// 連線成功
db.once('open', () => {
  console.log('mongoDB connected!')
})

// 設定 passport
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// 在 res.locals 裡的資料，所有的 view 都可以存取
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

// 設定路由器
app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurant'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))

app.listen(port, () => {
  console.log('My_restaurant server is running......')
})
