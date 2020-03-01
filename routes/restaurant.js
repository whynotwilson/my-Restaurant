const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// 設定路由
// 排列，放在後面不行，會先進入 "列出全部 Restaurant"，原因還沒找到
router.get('/sort', (req, res) => {
  let sortKeyword = ''
  let sortValue
  if (req.query.sort === 'a-z') {
    sortKeyword = 'name'
    sortValue = 1
  } else if (req.query.sort === 'z-a') {
    sortKeyword = 'name'
    sortValue = -1
  } else if (req.query.sort === 'ratingHTL') {
    sortKeyword = 'rating'
    sortValue = -1
  } else if (req.query.sort === 'ratingLTH') {
    sortKeyword = 'rating'
    sortValue = 1
  } else if (req.query.sort === 'category') {
    sortKeyword = 'category'
    sortValue = -1
  }

  // [] 使用變數的時候使用
  // .sort({ [sortKeyword]: sortValue }) //[sortKeyword] 代表的是 sortKeyword 裡面的值
  Restaurant.find()
    .collation({ locale: 'en_US' }) // 設定英文語系排序
    .sort({ [sortKeyword]: sortValue })
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      return res.render('index', { restaurants })
    })
})

// 列出全部 Restaurant
router.get('/', (req, res) => {
  console.log('列出全部 Restaurant')
  Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      return res.render('index', { restaurants })
    })
})

// 新增一筆 Restaurant 頁面
router.get('/new', (req, res) => {
  return res.render('new')
})

// 顯示一筆 Restaurant 的詳細內容
router.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('detail', { restaurant })
    })
})

// 搜尋
router.post('/search', (req, res) => {
  Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      restaurants = restaurants.filter(item =>
        item.name.toLowerCase().includes(req.body.keyword.toLowerCase()) || // 中文名稱符合
        item.name_en.toLowerCase().includes(req.body.keyword.toLowerCase()) || // 英文名稱符合
        item.category.toLowerCase().includes(req.body.keyword.toLowerCase()) // 餐廳分類符合
      )
      return res.render('index', { restaurants, keyword: req.body.keyword })
    })
})

// 新增一筆  Restaurant
router.post('/', (req, res) => {
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
router.get('/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('edit', { restaurant })
    })
})

// 修改 Restaurant
router.put('/:id', (req, res) => {
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
router.delete('/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router