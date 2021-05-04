const mongoose = require('mongoose');

function connect() {
  mongoose.connect('mongodb://localhost:27017/witnessdb', {
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