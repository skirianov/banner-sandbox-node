const nodeCron = require('node-cron');
const fs = require('fs');
const { twitterClient } = require('../api/twitter');
const {Square, LastUpdatedSquares} = require('../db/schema');
const { convertImageFromArray, createImageFromBuffer } = require('../utils/convertImage');
const path = require('path');
const moment = require('moment');

const job = nodeCron.schedule('*/20 * * * *', async () => {
  console.log('running a task every 20 minutes');

  const squares = await Square.find({});
  const lastUpdatedSquares = await LastUpdatedSquares.findOne({}).squares;

  //compare squares and lastUpdatedSquares
  const updatedSquares = squares.filter((square, index) => {
    return square.color !== lastUpdatedSquares[index].color;
  });

  if (updatedSquares.length > 0) {
    const imageBuffer = convertImageFromArray(squares);
    createImageFromBuffer(imageBuffer, '../assets/banner.png');
  
    console.log('image created');
    
    const banner = fs.readFileSync(path.join(__dirname, '../assets/banner.png'));
  
    try {
      const twitterResponse = await twitterClient.v1.updateAccountProfileBanner(banner, {
        offset_left: 0,
        offset_top: 0,
      })
  
      console.log(twitterResponse);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('no changes');
  }
});

const saveBanner = nodeCron.schedule('*/5 * * * *', async () => {
  const squares = await Square.find({});

  const lastUpdatedSquares = await LastUpdatedSquares.findOne({}).squares;

  //compare squares and lastUpdatedSquares
  const updatedSquares = squares.filter((square, index) => {
    return square.color !== lastUpdatedSquares[index].color;
  });

  if (updatedSquares.length > 0) {
    const imageBuffer = convertImageFromArray(squares);
    const currentTime = moment().format('YYYY-MM-DD-HH-mm-ss');
  
    createImageFromBuffer(imageBuffer, '../assets/progress' + currentTime + '.png');

    console.log('image created');
  } else {
    console.log('no changes');
  }
})

// const compareSquares = nodeCron.schedule('*/2 * * * *', async () => {
//   console.log('comparing squares');

//   const squaresFromJson = fs.readFileSync(path.join(__dirname, 'squares.json'));

module.exports = { job, saveBanner };