const User = require('../models/User');
const Game = require('../models/Game');
const { globalState } = require('../utils/globalState');

exports.createRoomController = (req, res) => {
  const { userId } = req.userDetails;

  if (globalState.isUserPresent(userId)) {
    return res.status(200).send({ message: 'Already created/ present in a room, so you can not create a room!!', error: true });
  }

  let roomId;

  for (let i = 1000; i < 10000; i++) {
    if (!globalState.isRoomPresent(i)) {
      roomId = i;
      break;
    }
  }

  globalState.setRoomDetailsById(roomId, { users: [], owner: userId });

  return res.status(200).send({ roomId });
}

exports.exitGameController = (req, res) => {
  const { roomId, gameFinished, deleteRoom } = req.params;

  if (deleteRoom) {
    const allRoomDetails = globalState.getAllGameDetails();

    const roomDetails = allRoomDetails[roomId];

    // Delete socket owner and the delete all members in the room present
    const allSocketDetails = globalState.getAllSocketDetails();

    const ownerId = roomDetails['owner'];
    delete allSocketDetails[ownerId];

    for (let user in roomDetails['users']) {
      delete allSocketDetails[user];
    }

    delete allRoomDetails[roomId];
    globalState.setSocketDetails(allSocketDetails);
    globalState.setRoomDetails(allRoomDetails);

    return res.status(200).send({ message: 'Deleted room successfully' });
  } if (gameFinished) {
    // First save details by room ID
    saveGameDetailsToDB(roomId);

    const allRoomDetails = globalState.getAllGameDetails();

    const roomDetails = allRoomDetails[roomId];

    // Delete socket owner and the delete all members in the room present
    const allSocketDetails = globalState.getAllSocketDetails();

    const ownerId = roomDetails['owner'];
    delete allSocketDetails[ownerId];

    for (let user in roomDetails['users']) {
      delete allSocketDetails[user];
    }

    delete allRoomDetails[roomId];
    globalState.setSocketDetails(allSocketDetails);
    globalState.setRoomDetails(allRoomDetails);

    const allGameDetails = globalState.getAllGameDetails();
    delete allGameDetails[roomId];
    globalState.setGameDetails(allGameDetails);

    return res.status(200).send({ message: 'Saved to DB!!' });
  }
}

// Write logic before saving to DB
const saveGameDetailsToDB = (roomId) => {

}

exports.gameHistoryController = async (req, res) => {
  const { userId } = req.userDetails;
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