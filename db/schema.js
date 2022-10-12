const mongoose = require('mongoose');
const { Schema } = mongoose;

const squareSchema = new Schema({
  x: Number,
  y: Number,
  id: String,
  color: String,
  old_color: String,
  status: String,
  owner: String
});

const lastUpdatedSquares = new Schema({
  date: Date
});

const Square = mongoose.model('Square', squareSchema);
const LastUpdatedTime = mongoose.model('LastUpdatedTime', lastUpdatedSquares);

module.exports = { Square, LastUpdatedTime };