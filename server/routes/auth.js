const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Game = require('../models/Game');

const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwtTokenVerification = require('../middleware/jwtTokenVerification');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user || user.password !== password)
      return res.status(404);
    const userID = user._id.toString();
    const token = jwt.sign(userID, JWT_SECRET_KEY);
    return res.status(200).send({ token });
  } catch (err) {
    return res.status(404);
  }
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    const userID = user._id.toString();
    const token = jwt.sign(userID, JWT_SECRET_KEY);
    return res.status(200).send({ token });
  } catch (err) {
    return res.status(404);
  }
});

router.get('/profile', jwtTokenVerification, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);

  const { page, size } = req.query;
  const ids = [];
  let length = page + size < user.gameIds.length ? page + size : user.gameIds.length;
  for (let i = page; i < length; i++)
    ids.push(user.gameIds[i]);

  const gameDetails = await Game.find({
    '_id': {
      $in: ids
    }
  });

  return res.status(200).send(gameDetails);
});

exports.router = router;