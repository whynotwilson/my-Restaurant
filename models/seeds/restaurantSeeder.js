const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantData = require('../../restaurant.json').results

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')

  for (var i = 0; i < restaurantData.length; i++) {
    Restaurant.create({
      name: restaurantData[i].name,
      name_en: restaurantData[i].name_en,
      category: restaurantData[i].category,
      image: restaurantData[i].image,
      location: restaurantData[i].location,
      phone: restaurantData[i].phone,
      google_map: restaurantData[i].google_map,
      rating: restaurantData[i].rating,
      description: restaurantData[i].description
    })
    // Restaurant.create({ name: 'test' + i })
  }

  console.log('done')
})
