const User = require('../models/User');
const Game = require('../models/Game');
const globalState = require('../utils/globalState');
const drawingItemNamesList = require('../utils/drawingItem');

exports.createRoomService = async (req, res) => {
  console.log(req);
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

exports.gameHistoryService = async (req, res) => {
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

exports.gameDetailsService = async (req, res) => {
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

// const obj = {
//   roomId: {
//     levels: [
//       {
//         "userId": score,
//       }, {
//         "userId": score,
//       }
//     ],
//     drawings: [
//       "item-1", "item-2"
//     ],
//     users: {
//       "userId": { playing: CONSTANT, totalScore: NUMBER, level: NUMBER }
//     }
//   }
// }

exports.getNextLevelDrawingItem = ({ roomId, userId }) => {
  const gameDetails = globalState.getGameDetailsById(roomId);

  if (gameDetails['users'][userId]['level'] != 3) {
    const { level } = gameDetails['users'][userId];

    if (gameDetails['drawings'].length > level) {
      gameDetails['users'][userId]['level']++;
      gameDetails['levels'][level][userId] = 0;
      globalState.setGameDetailsById(roomId, gameDetails);
      return gameDetails['drawings'][level];
    }

    if (level !== 0 && (userId in gameDetails['levels'][level - 1]) && gameDetails['levels'][level - 1][userId] === 0)
      return gameDetails['drawings'][level-1];

    const generatedDrawingItem = generateRandomDrawing(gameDetails['drawings'].length + 1)
    gameDetails['drawings'].push(generatedDrawingItem);
    gameDetails['levels'].push({});
    gameDetails['levels'][level][userId] = 0;
    gameDetails['users'][userId]['level']++;
    globalState.setGameDetailsById(roomId, gameDetails);

    return generatedDrawingItem;
  } else {
    return false;
  }

}

const generateRandomDrawing = (level) => {
  if (level == 3) {
    return drawingItemNamesList[Math.floor(Math.random() * 99 + 100 * (level - 1))];
  } else {
    return drawingItemNamesList[Math.floor(Math.random() * 144 + 100 * (level - 1))];
  }
}

// As of now, game is developed in such a way that it uses only one socket connection to connect and rooms are created
// In future more optimised version will come with better speed and scalability
// At present, I came up with a solution which does not have refresh feature and also if their is network interruption this does not works fine in some areas
// In future, I will also address these above issues to make this more reliable and scalable with whatever best features I can come up I will definitely bring up
// And doodlenet classifier is on client side as of which frontend part becomes heavy and it can take up good amount of time and makes client side a bit slow and memory might be eaten up because of network which needs to share the calssifier for every client