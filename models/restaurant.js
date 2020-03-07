const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  name_en: {
    type: String
  },
  category: {
    type: String
  },
  image: {
    type: String
  },
  location: {
    type: String
  },
  phone: {
    type: String
  },
  google_map: {
    type: String
  },
  rating: {
    type: String
  },
  description: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // 定義這個屬性是從 User model 取得
    index: true, // 索引，設定成可用來查詢
    required: true
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
