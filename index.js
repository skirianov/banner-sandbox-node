const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const fs = require('fs');

const { CONNECT_WITH_MONGO } = require('./db/connection');
const { CONNECT_WITH_REDIS } = require('./cache/connect-redis');
const routes = require('./api/squares');
const { populateDb } = require('./utils/populateSquares');
const { twitterClient } = require('./api/twitter');
const { job } = require('./cron/cron-job');

require('dotenv').config();

const app = express();
const port = 3000;

const server = http.createServer(app);
const ws = require('./websocket/ws').init(server);

CONNECT_WITH_MONGO();
CONNECT_WITH_REDIS();

app.use(cors());
app.use(express.json());
app.use(morgan('common'));
app.use(routes);

server.listen(port, () => console.log(`Example app listening on port ${port}!`));