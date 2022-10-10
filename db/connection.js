const { default: mongoose } = require("mongoose");

const CONNECT_WITH_MONGO = () => {
  const MONGODB = process.env.MONGODB;

  mongoose.connect(MONGODB);
  const db = mongoose.connection;

  db.on('error', (error) => {
    console.log(error)
  });

  db.once('connected', () => {
    console.log('Database Connected');
  });
}

module.exports = { CONNECT_WITH_MONGO };