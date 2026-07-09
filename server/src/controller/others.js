const User = require('../models/User');
const drawingItemNamesList = require('../utils/drawingItem');

// Returns a random drawing prompt for solo practice mode. The labels are the
// Quick, Draw! / DoodleNet category names, so the same string is used both as
// the prompt shown to the player and as the target for client-side scoring.
exports.getDrawingItemController = (req, res) => {
  try {
    const drawingItem = drawingItemNamesList[Math.floor(Math.random() * drawingItemNamesList.length)];
    return res.status(200).send({ drawingItem });
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while fetching drawing item' });
  }
}

exports.homeController = async (req, res) => {
  const { userId } = req.userDetails;

  const user = await User.findById(userId, { noOfGamesPlayed: 1 });

  return res.status(200).send({ noOfGamesPlayed: user.noOfGamesPlayed });
}

exports.profileController = async (req, res) => {
  const { userId } = req.userDetails;

  const user = await User.findById(userId, { username: 1, gameIds: 1, email: 1 });

  return res.status(200).send({ username: user.username, noOfGamesPlayed: user.gameIds.length, email: user.email });
}