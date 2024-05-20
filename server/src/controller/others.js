const User = require('../models/User');

exports.homeController = async (req, res) => {
  const { userId } = req.userDetails;

  const { gameIds } = await User.findById(userId, { gameIds: 1 });

  return res.status(200).send({ noOfGamesPlayed: gameIds.length });
}

exports.profileController = async (req, res) => {
  const { userId } = req.userDetails;

  const user = await User.findById(userId, { username: 1, gameIds: 1 });

  return res.status(200).send({ username: user.username, noOfGamesPlayed: user.gameIds.length });
}