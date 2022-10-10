const redis = require('redis');

const redisClient = redis.createClient({
  host: 'redis.ptzrgx.ng.0001.use2.cache.amazonaws.com',
  port: process.env.REDIS_PORT || 6379,
});

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