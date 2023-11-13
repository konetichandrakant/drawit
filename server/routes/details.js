const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('../jwtTokenVerification');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = require('../models/User');
const UserAuth = require('../models/UserAuth');
const Game = require('../models/Game');

router.post('/login', async (req, res) => {
  try {
    const user = await UserAuth.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password)
      return res.status(404);
    const userID = user._id;
    const token = jwt.sign(userID, JWT_SECRET_KEY, {});
    const username = req.body.email.split('@')[0];
    return res.send({ token, username });
  } catch (err) {
    return res.status(404);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAuth = await UserAuth({ email, password });
    const user = await User({ userAuthID: userAuth._id });
    userAuth.userID = user._id;
    await userAuth.save();
    await user.save();
    const userID = user._id;
    const token = jwt.sign(userID, JWT_SECRET_KEY, {});
    const username = req.body.email.split('@')[0];
    return res.send({ token, username });
  } catch (err) {
    return res.status(404);
  }
});

router.get('/', jwtTokenVerification, async (req, res) => {
  const _id = req.id;
  const user = await User.findById(_id);
  if (!user)
    return res.status(404);
  return res.send({ matches: user.gameIds.length(), matchesWon: user.gamesWon });
});

router.get('/profile', jwtTokenVerification, async (req, res) => {
  const _id = req.id;
  const user = await User.findById(_id);
  const username = await UserAuth.findById(user.userAuthID).email.split('@')[0];
  if (!user)
    return res.status(404);
  const gameDetails =
    await Game.find({ _id: { $in: user.gameIds } })
      .skip(startIndex)
      .limit(pageSize);
  return res.send({ username, noOfGames: user.gameIds.length(), noOfGamesWon: user.gamesWon, gameDetails });
});

module.exports = router;
