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
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// 顯示一筆 Restaurant 的詳細內容
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('detail', { restaurant })
    })
})
// 新增一筆  Restaurant
app.post('/restaurants', (req, res) => {
  const restaurant = new Restaurant({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

// 修改 Restaurant 頁面
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('edit', { restaurant })
    })
})

// 修改 Restaurant
app.post('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.name = req.body.name
    restaurant.name_en = req.body.name_en
    restaurant.category = req.body.category
    restaurant.image = req.body.image
    restaurant.location = req.body.location
    restaurant.phone = req.body.phone
    restaurant.google_map = req.body.google_map
    restaurant.rating = req.body.rating
    restaurant.description = req.body.description

    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})
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
