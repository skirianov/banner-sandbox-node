const redis = require('redis');

const redisClient = redis.createClient();

const CONNECT_WITH_REDIS = async () => {
  redisClient.on('error', (error) => {
    console.log(error);
  });

  redisClient.on('connect', () => {
    console.log('Redis Connected');
  });

  await redisClient.connect();
}

module.exports = { CONNECT_WITH_REDIS, redisClient };