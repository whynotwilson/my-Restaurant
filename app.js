const express = require('express')
const restaurants = require('./restaurant.json')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
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

// setting route
// 首頁
app.get('/', (req, res) => {
  const restaurantList = restaurants.results
  res.render('index', { restaurantList })
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.results
  console.log(restaurant[Number(id) - 1])
  res.render('show', { restaurant: restaurant[Number(id) - 1] })
})

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
