const User = require('../models/User');

const jwt = require('jsonwebtoken');

require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user || user.password !== password)
      return res.status(200).send({ message: '** Incorrect email or password **' });

    const userId = user._id.toString();
    const token = jwt.sign({ userId, email }, JWT_SECRET_KEY, { algorithm: 'HS256' });

    return res.status(200).send({ token: `Bearer ${token}` });
  } catch (err) {
    return res.status(200).send({ message: 'Some error occured please try again!!' });
  }
}

exports.registerController = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const isNotPresent = !(await (User.findOne({ email })));

    if (!isNotPresent)
      return res.status(200).send({ message: 'User with the entered email already exists!!' });

    const user = new User({ email, password, username });
    await user.save();

    const userId = user._id.toString();
    const token = jwt.sign({ userId, email }, JWT_SECRET_KEY, { algorithm: 'HS256' });

    return res.status(200).send({ token: `Bearer ${token}` });
  } catch (err) {
    return res.status(404);
  }
}