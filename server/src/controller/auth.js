const User = require('../models/User');

const jwt = require('jsonwebtoken');

require("dotenv").config();

exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user || user.password !== password)
      return res.status(200).send({ message: '** Incorrect email or password **' });

    const userId = user._id.toString();
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });

    return res.status(200).send({ token: `Bearer ${token}` });
  } catch (err) {
    return res.status(200).send({ message: 'Some error occured please try again!!' });
  }
}

exports.registerController = async (req, res) => {
  const { email, password, username } = req.body;
  console.log(req.body);

  try {
    const userWithEmail = await User.findOne({ email });
    console.log(userWithEmail);

    if (userWithEmail)
      return res.status(200).send({ message: 'User with the entered email already exists!!' });

    const user = new User({ email, password, username });
    await user.save();
    console.log(user);

    const userId = user._id.toString();
    console.log(userId);
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });

    return res.status(200).send({ token: `Bearer ${token}` });
  } catch (err) {
    return res.status(500).send({ message: 'Error while registering' });
  }
}