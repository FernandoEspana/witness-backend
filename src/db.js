const mongoose = require('mongoose');

function connect() {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once('open', () => {
    console.log('Connection established succesfully');
  });

  mongoose.connection.on('error', (err) => {
    console.log('Something went worng', err);
  });

  return mongoose.connection
}

module.exports = { connect }