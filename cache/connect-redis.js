const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
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