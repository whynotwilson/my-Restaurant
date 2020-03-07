const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantData = require('../../restaurant.json').results
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')

  const users = []
  users.push(new User({
    email: 'user1@example.com',
    password: '12345678'
  }))
  users.push(new User({
    email: 'user2@example.com',
    password: '12345678'
  }))

  users.forEach((newUser) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return console.log(err)

      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return console.log(err)

        newUser.password = hash
        newUser.save()
          .then()
          .catch(err => { if (err) console.log(err) })
      })
    })
  })

  // 不要使用 json 裡面的 id
  restaurantData.forEach((restaurant) => delete restaurant.id)

  for (let i = 0; i < 6; i++) {
    if (i < 3) {
      restaurantData[i].userId = users[0].id
    } else {
      restaurantData[i].userId = users[1].id
    }
    Restaurant.create(restaurantData[i])
  }

  console.log('done')
})
