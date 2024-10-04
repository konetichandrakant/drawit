const { JOIN_GAME_ROOM, NEXT_LEVEL, UPDATE_LEADERBOARD } = require('../utils/constants');
const globalState = require('../utils/globalState');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getNextLevelDrawingItem } = require('../services/gameService');
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