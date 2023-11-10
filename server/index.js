const express = require('express');
const app = express();
const { jwtTokenVerification } = require('./jwtTokenVerification');

const User = require('./models/User');

app.use(express.json());
// app.use('/game', require('./game'));


app.post('/login', (req, res) => {
  try {

  } catch (err) {

  }
})

app.post('/register', (req, res) => {
  try {

  } catch (err) {

  }
})

app.get('/', (req, res) => {
  const _id = req.id;
  console.log('home');
  return res.send({ token: 'nice' });
})

app.get('/profile', jwtTokenVerification, (req, res) => {
  const _id = req.id;
})

app.post('/profile', jwtTokenVerification, (req, res) => {

})

app.listen(8080);