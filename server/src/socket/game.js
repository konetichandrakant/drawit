const { JOIN_GAME_ROOM, NEXT_LEVEL, UPDATE_LEADERBOARD } = require('../utils/constants');
const globalState = require('../utils/globalState');
const drawingItemNamesList = require('../utils/drawingItem');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const getUserDetails = (token) => {
  if (!token || !token.startsWith('Bearer ')) {
    return next(new Error('Invalid token format')); // More specific error message
  }

  const authToken = token.substring(7); // Assuming token format is "Bearer <token>"
  return jwt.verify(authToken, process.env.JWT_SECRET_KEY);
}

const setUserDetailsToSocket = async (token, socketId) => {

  if (!token || !token.startsWith('Bearer ')) {
    return next(new Error('Invalid token format')); // More specific error message
  }

  const authToken = token.substring(7); // Assuming token format is "Bearer <token>"
  const { userId } = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
  const { username } = await User.findById(userId, { username: 1 });

  globalState.setUserDetailsById(userId, { username, socketId });
}

exports.gameSocket = (io) => {

  io.on('connection', (socket) => {
    console.log('socket connected id: ' + socket.id);

    socket.on(JOIN_GAME_ROOM, () => {
      setUserDetailsToSocket(socket.handshake.auth.token, socket.id);
    })

    socket.on(NEXT_LEVEL, (data) => {
      console.log(data);
      const { userId } = getUserDetails(socket.handshake.auth.token);
      const { roomId } = data;

      const nextLevelDetails = getNextLevelDrawingItem({ roomId, userId });
      console.log(globalState.getGameDetailsById(roomId), nextLevelDetails);

      if (!nextLevelDetails) {
        return socket.emit(NEXT_LEVEL, { completed: true });
      } else {
        return socket.emit(NEXT_LEVEL, { drawingItem: nextLevelDetails });
      }
    })

    socket.on(UPDATE_LEADERBOARD, (data) => {
      const { userId } = getUserDetails(socket.handshake.auth.token);
      const { roomId, score, level } = data;

      const gameDetails = globalState.getRoomDetailsById(roomId);
      gameDetails['levels'][level][userId] = score;
      globalState.setGameDetailsById(roomId, gameDetails);

      io.to(roomId).emit(UPDATE_LEADERBOARD, { userId, score });
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected with id: ' + socket.id);
    })

  })
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

const getNextLevelDrawingItem = ({ roomId, userId }) => {
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