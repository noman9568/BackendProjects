const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;
db.once('open',()=>{
  console.log('Connected Database!');
});

module.exports = db;