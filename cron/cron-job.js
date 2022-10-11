const nodeCron = require('node-cron');
const fs = require('fs');
const { twitterClient } = require('../api/twitter');
const Square = require('../db/schema');
const { convertImageFromArray, createImageFromBuffer } = require('../utils/convertImage');
const path = require('path');
const moment = require('moment');

const job = nodeCron.schedule('*/20 * * * *', async () => {
  console.log('running a task every 20 minutes');

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

// const compareSquares = nodeCron.schedule('*/2 * * * *', async () => {
//   console.log('comparing squares');

//   const squaresFromJson = fs.readFileSync(path.join(__dirname, 'squares.json'));
//   const squaresJSON = JSON.parse(squaresFromJson);

//   console.log(squaresJSON)
// });

// const squareData = nodeCron.schedule('*/1 * * * *', async () => {
//   console.log('saving data in json');

//   const squaresJson = JSON.stringify(squares);
//   fs.writeFileSync('squares.json', squaresJson);
// })

// squareData.start();
// compareSquares.start();

// uncomment once BETA is over
// const tweetBannerUpdate = nodeCron.schedule('0 12 */1 * *', async () => {
//   const banner = fs.readFileSync(path.join(__dirname, '../assets/banner.png'));

//   try {
//     await twitterClient.v1.tweet({
//       status: `New banner update! Let's see what you come up with! Want to join? https://dancing-kitsune-2b3b6a.netlify.app/`,
//       media_ids: [banner]
//     })
//   } catch(error) {
//     console.log(error);
//   }
// });

module.exports = { job, saveBanner };