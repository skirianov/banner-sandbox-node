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
const LastUpdatedSquares = mongoose.model('LastUpdatedSquares', lastUpdatedSquares);

module.exports = { Square, LastUpdatedSquares };