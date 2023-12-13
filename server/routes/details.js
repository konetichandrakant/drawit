const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('../jwtTokenVerification');
const jwt = require('jsonwebtoken');
const keys = require('../keys');
const JWT_SECRET_KEY = keys.JWT_SECRET_KEY;
const User = require('../models/User');
const Game = require('../models/Game');

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user || user.password !== req.body.password)
      return res.status(404).send(false);
    const userID = user._id.toString();
    const token = jwt.sign(userID, JWT_SECRET_KEY);
    console.log(token);
    return res.send({ token });
  } catch (err) {
    return res.status(404);
  }
});

router.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User({ email, password });
    await user.save();
    const userID = user._id.toString();
    const token = jwt.sign(userID, JWT_SECRET_KEY);
    console.log(token);
    return res.send({ token });
  } catch (err) {
    return res.status(404);
  }
});

router.post('/', jwtTokenVerification, async (req, res) => {
  const userId = req.id;
  console.log(userId);
  const user = await User.findById(userId);
  console.log(user);
  if (!user)
    return res.status(404).send(false);
  return res.send({ matches: user.gameIds.length });
});

router.get('/profile', jwtTokenVerification, async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId);
  if (!user)
    return user;
  //   return res.status(404);
  // const gameDetails =
  //   await Game.find({ _id: { $in: user.gameIds } })
  //     .skip(startIndex)
  //     .limit(pageSize);
  // return res.send({ username, noOfGames: user.gameIds.length(), noOfGamesWon: user.gamesWon, gameDetails });
});

module.exports = router;
