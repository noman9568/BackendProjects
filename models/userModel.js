const mongoose = require('mongoose');

let userInfo = mongoose.Schema({
  name:String,
  description:String
});

module.exports = mongoose.model('user',userInfo);