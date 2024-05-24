const User = require('../models/User');
const Game = require('../models/Game');
const globalState = require('../utils/globalState');

exports.createRoomController = async (req, res) => {
  const { userId } = req.userDetails;

  let roomId;

  for (let i = 1000; i < 10000; i++) {
    if (!globalState.isRoomPresent(i)) {
      roomId = i;
      break;
    }
  }

  const { username } = await User.findById(userId, { username: 1 });

  globalState.setUserDetailsById(userId, { username, socketId: null });
  globalState.setRoomDetailsById(roomId, { users: [], owner: userId });

  return res.status(200).send({ roomId });
}

exports.gameHistoryController = async (req, res) => {
  const { userId } = req.userDetails;
  const user = await User.findById(userId);

  const { page, limit } = req.query;
  const ids = [];
  let length = page + limit < user.gameIds.length ? page + limit : user.gameIds.length;
  for (let i = page; i < length; i++)
    ids.push(user.gameIds[i]);

  try {
    const gameDetails = await Game.find({
      _id: {
        $in: ids
      }
    });

    return res.status(200).send(gameDetails);
  } catch (e) {
    return res.status(500).send({ message: 'Some error occured' });
  }
}

exports.gameDetailsController = async (req, res) => {
  const { userId } = req.userDetails;
  const { gameId } = req.params;

  const gamedetails = await Game.findById(gameId);

  // Is the user authenticated
  for (let userInformation in gamedetails['userInformation']) {
    if (userId in userInformation) {
      return res.status(200).send(gamedetails);
    }
  }

  return res.status(401).send({ message: 'Not authorized' });
}