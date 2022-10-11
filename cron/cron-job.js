const nodeCron = require('node-cron');
const fs = require('fs');
const { twitterClient } = require('../api/twitter');
const Square = require('../db/schema');
const { convertImageFromArray, createImageFromBuffer } = require('../utils/convertImage');
const path = require('path');
const moment = require('moment');

const job = nodeCron.schedule('*/10 * * * *', async () => {
  console.log('running a task every 10 minutes');

  const squares = await Square.find({});
  
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
});

const saveBanner = nodeCron.schedule('*/5 * * * *', async () => {
  console.log('saving banner');

  const squares = await Square.find({});
  const imageBuffer = convertImageFromArray(squares);
  const currentTime = moment().format('YYYY-MM-DD-HH-mm-ss');

  createImageFromBuffer(imageBuffer, '../assets/progress' + currentTime + '.png');
})

module.exports = { job, saveBanner };