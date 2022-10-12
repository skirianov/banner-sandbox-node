const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');

const { CONNECT_WITH_MONGO } = require('./db/connection');
const { CONNECT_WITH_REDIS } = require('./cache/connect-redis');
const routes = require('./api/squares');
const { job, saveBanner, tweetBannerOncePerDay } = require('./cron/cron-job');
const { twitterClient } = require('./api/twitter');

require('dotenv').config();

const app = express();

const server = http.createServer(app);
const ws = require('./websocket/ws').init(server);

CONNECT_WITH_MONGO();
CONNECT_WITH_REDIS();

app.use(cors());
app.use(express.json());
app.use(morgan('common'));
app.use(routes);

app.get('/', (req,res) => {
  res.send('Hello World');
});

const tweetBanner = async () => {
  const banner = fs.readFileSync(path.join(__dirname, '../assets/banner.png'));

  try {
    await twitterClient.v1.tweet({
      status: `
      Hey there! Check out my banner for today! Want to paint something? DM me for closed Beta access!

      --- automated message <3 --- `,
      media_ids: [banner]
    })

    console.log('Daily banner tweeted');
  } catch (error) {
    console.log(error);
  }

}

tweetBanner();

server.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT || 3000}!`));