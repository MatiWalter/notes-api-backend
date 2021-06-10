const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const { MONGO_BD_URI, MONGO_BD_URI_TEST, NODE_ENV } = process.env;

// const connectionString = NODE_ENV === 'test'
//   ? MONGO_BD_URI_TEST
//   : MONGO_BD_URI;

const connectionString = MONGO_BD_URI_TEST;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    console.log('Database connected');
  }).catch((err) => {
    console.log(err);
  });

process.on('uncaughtException', () => {
  mongoose.connection.disconnect();
});
