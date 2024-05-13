const User = require('../models/User');

exports.homeController = async (req, res) => {
  const { userId } = req.userDetails;
  const user = await User.findById(userId);

  return res.status(200).send({ noOfGamesPlayed: user.gameIds.length });
}

exports.profileController = async (req, res) => {
  const { userId, email } = req.userDetails;

  const user = await User.findById(userId, { username: 1, gameIds: 1 });

  return res.status(200).send({ email, username, noOfGamesPlayed: user.gameIds.length });
}