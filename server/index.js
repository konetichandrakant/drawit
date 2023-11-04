const express = require('express');
const app = express();
const tokenVerification = require('./jwtTokenVerification');

const User = require('./models/User');
const game = require('./game');

app.use(express.json());

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

app.get('/', tokenVerification, (req, res) => {
  const _id = req.id;
})

router.get('/profile', tokenVerification, (req, res) => {
  const _id = req.id;
})

router.post('/profile', tokenVerification, (req, res) => {

})

app.use('/game',game);

app.listen(3000);