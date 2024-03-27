const User = require('../models/User');

exports.profileController = async (req, res) => {
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
}

exports.homeController = async (req, res) => {
  return '';
}