const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('../jwtTokenVerification');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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
  const userId = req.id;
  const user = await User.findById(userId);
  
});

module.exports = router;
