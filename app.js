const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定靜態檔案
app.use(express.static('public'))

// 資料庫連線
mongoose.connect('mongodb://localhost/restaurant', {
  useNewUrlParser: true, useUnifiedTopology: true
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

// 設定路由器
app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurant'))
app.use('/users', require('./routes/user'))

app.listen(port, () => {
  console.log('My_restaurant server is running......')
})
