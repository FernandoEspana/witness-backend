const express = require('express');
const { connect } = require('./db');

const app = express();
connect();
app.use(express.json());

app.listen(8000, ()=> {
  console.log('Server is running on port 8000');
});

app.get('/', (req,res) => {
  console.log('Receiving a request');
  res.status(200).json({ message: "Hola amiguis"});
})
