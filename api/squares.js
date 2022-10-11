const { redisClient } = require('../cache/connect-redis');
const { Square, LastUpdatedSquares } = require('../db/schema');

const routes = require('express').Router();

routes.get('/squares', async(req, res) => {
  let squares;

  try {
    const cachedSquares = await redisClient.get('squares');

    if (cachedSquares) {
      squares = JSON.parse(cachedSquares);
      console.log('Serving from cache');
    } else {
      squares = await Square.find();
      await redisClient.set('squares', JSON.stringify(squares));
      console.log('Serving from database');
    }
  } catch (error) {
    console.log(error);
  }

  squares.forEach(each => {
    each.old_color = each.color;
  })

  res.send(squares);
});

routes.put('/squares/:id', async(req, res) => {
  const { id } = req.params;
  const { owner, color } = req.body;

  let square = await Square.findOne({ id });

  square.old_color = color | square.color;
  square.color = color;
  square.owner = owner;

  await square.save();

  const cachedSquares = await redisClient.get('squares');
  const squares = JSON.parse(cachedSquares);

  const index = squares.findIndex(square => square.id === id);
  squares[index] = square;

  const lastUpdatedSquares = await LastUpdatedSquares.find({});
  lastUpdatedSquares[0].squares = squares;

  await lastUpdatedSquares[0].save();

  await redisClient.set('squares', JSON.stringify(squares));

  console.log('store to db and cache');

  const ws = require('../websocket/ws').getWS();

  ws.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(squares));
    }
  });

  res.send(square);
});

module.exports = routes;