const nodeCron = require('node-cron');
const fs = require('fs');
const { twitterClient } = require('../api/twitter');
const { Square, LastUpdate } = require('../db/schema');
const { convertImageFromArray, createImageFromBuffer } = require('../utils/convertImage');
const path = require('path');
const moment = require('moment');

const job = nodeCron.schedule('*/20 * * * *', async () => {
  console.log('running a task every 20 minutes');

  const squares = await Square.find({});

  const time = new Date();
  const lastUpdate = LastUpdate.findOne({});

  // if last update is less than 15 minutes ago, create image and tweet

  if (time - lastUpdate.lastUpdate < 900000) {
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
    console.log('no changes in the last 20 minutes');
  }
});

const saveBanner = nodeCron.schedule('*/5 * * * *', async () => {
  console.log('saving banner');

  const time = new Date();
  const lastUpdate = LastUpdate.findOne({});

  // if last update is less than 4 minutes ago, create image and tweet

  if (time - lastUpdate.lastUpdate < 240000) {
    const squares = await Square.find({});
    const imageBuffer = convertImageFromArray(squares);
    const currentTime = moment().format('YYYY-MM-DD-HH-mm-ss');
  
    createImageFromBuffer(imageBuffer, '../assets/progress' + currentTime + '.png');
  } else {
    console.log('no changes in the last 5 minutes');
  }
})

module.exports = { job, saveBanner };