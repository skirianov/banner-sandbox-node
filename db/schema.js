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

const lastUpdateSchema = new Schema({
  lastUpdate: Date
});

const Square = mongoose.model('Square', squareSchema);
const LastUpdate = mongoose.model('LastUpdate', lastUpdateSchema);

module.exports = {
  Square,
  LastUpdate
}