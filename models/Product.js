const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "必填"]
  },
  description: {
    type: String,
    required: [true, "必填"]
  },
  price: {
    type: String,
    required: [true, "必填"]
  },
  inventory: {
    type: Number,
    required: [true, "必填"]
  },
  category: {
    type: String,
    required: [true, "必填"]
  },
  subCategory: {
    type: String,
    required: [true, "必填"]
  },
  pictures: {
    type: Array,
    required: true
  }
}, {minimize: false});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
