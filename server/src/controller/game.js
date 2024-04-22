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

exports.postGameDetailsController = (req, res) => {
  const game = Game.findById(req.gameId);

  if (!game)
    return res.status(404);

  return res.status(200).send(game);
}

exports.exitGameController = (req, res) => {

}

exports.stopGameController = (req, res) => {

}

// exports.gameDetails = {};
// {
//   roomId: {
//     levelInformation:
//     [
//       {
//         drawingItem: "",
//         userInformation: {
//             "userId": score,
//         }
//       }
//     ]
//   }
// }

// exports.roomDetails = {};
// {
//   roomId: {
//     users: [ { userId: Boolean() }]
//     owner: userId
//   }
// }

// exports.socketDetails = {};
// {
//   userId: socketId
// }