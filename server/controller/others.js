const User = require('../models/User');
const Game = require('../models/Game');

exports.profileController = async (req, res) => {
  const { userId, email } = req.userDetails;
  const user = await User.findById(userId);

  if (user.email !== email)
    return res.status(200).send({ "invalidUser": true })

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
}

exports.homeController = async (req, res) => {
  const { userId, email } = req.userDetails;
  const user = await User.findById(userId);

  if (user.email !== email)
    return res.status(200).send({ "invalidUser": true })

  return res.status(200).send({ noOfGamesPlayed: user.gameIds.length });
}