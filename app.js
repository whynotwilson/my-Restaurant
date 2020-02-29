const express = require('express')
const restaurants = require('./restaurant.json')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// setting route
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
