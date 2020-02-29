const express = require('express')
const restaurants = require('./restaurant.json')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')

app.use(bodyParser.urlencoded({ extended: true }))
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

// 設定路由
// 首頁
app.get('/', (req, res) => {
  return res.redirect('/restaurants')
})

// 列出全部 Restaurant
app.get('/restaurants', (req, res) => {
  Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      return res.render('index', { restaurants })
    })
})

// 新增一筆 Restaurant 頁面

// 顯示一筆 Restaurant 的詳細內容

// 新增一筆  Restaurant

// 修改 Restaurant 頁面

// 修改 Restaurant

// 刪除 Restaurant

// 搜尋
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurantList = restaurants.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()
    )
  }
  )
  res.render('index', { restaurantList, keyword })
})

app.listen(port, () => {
  console.log('My_restaurant server is running......')
})
