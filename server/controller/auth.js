const User = require('../models/User');
const Game = require('../models/Game');

const jwt = require('jsonwebtoken');

require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.loginController = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    console.log(user, user.password !== password || !user);
    if (!user || user.password !== password)
      return res.status(200).send({ message: '** Incorrect email or password **' });
    const userID = user._id.toString();
    console.log(userID);
    const token = jwt.sign({ userID, email }, JWT_SECRET_KEY, { algorithm: 'HS256' });
    console.log(token);
    return res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    return res.status(200).send({ message: 'Some error occured please try again!!' });
  }
}

exports.registerController = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const isNotPresent = !(await (User.findOne({ email })));
    if (!isNotPresent)
      return res.status(200).send({ message: 'User with the entered email already exists!!' });
    const user = new User({ email, password });
    await user.save();
    const userID = user._id.toString();
    console.log(userID);
    const token = jwt.sign({ userID, email }, JWT_SECRET_KEY, { algorithm: 'HS256' });
    console.log(token);
    return res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    return res.status(404);
  }
}