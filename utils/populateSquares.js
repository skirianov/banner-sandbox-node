const { redisClient } = require("../cache/connect-redis");
const { db } = require("../db/schema");
const Square = require("../db/schema");

const populateDb = async () => {
  let WIDTH = 1500;
  let HEIGHT = 500;

  let sqWidth = 12;
  let sqHeight = 12;

  db.collection("squares").drop();

  const coordinateData = [];

  for (let i = 0; i <= WIDTH; i += sqWidth) {
    for (let j = 0; j <= HEIGHT; j += sqHeight) {
      const arr = { x: i, y: j, id:`${i},${j}`, color: '#FFFFFF', old_color: '#FFFFFF', status: 'unpainted', owner: '' };
      
      const square = new Square(arr);
      coordinateData.push(square);
    }
  }

  await Square.insertMany(coordinateData);

  // clear redis cache
  await redisClient.del("squares");

  console.log('Database Populated');
}

const generateRandomHEXColor = () => {
  const hex = '0123456789ABCDEF';

  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hex[Math.floor(Math.random() * 16)];
  }

  return color;
}

module.exports = { populateDb };