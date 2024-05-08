const { JOIN_ROOM_REQUEST, ACCEPTED_JOIN_ROOM, ROOM_CREATED, DENY_REQUEST } = require('../utils/constants');
const globalState = require('../utils/globalState');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getUserDetails = (token) => {
  if (!token || !token.startsWith('Bearer ')) {
    return next(new Error('Invalid token format')); // More specific error message
  }

  const authToken = token.substring(7); // Assuming token format is "Bearer <token>"
  return jwt.verify(authToken, process.env.JWT_SECRET_KEY);
}

const setUserDetailsToSocket = (token, socketId) => {

  if (!token || !token.startsWith('Bearer ')) {
    return next(new Error('Invalid token format')); // More specific error message
  }

  const authToken = token.substring(7); // Assuming token format is "Bearer <token>"
  const { email, userId } = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
  const username = email.split('@')[0];

  globalState.setSocketDetailsByUserId(userId, { username, socketId });
}

exports.roomSocket = (io) => {

  io.of('/room').on('connection', (socket) => {
    console.log('socket connected id: ' + socket.id);

    socket.on(ROOM_CREATED, (data) => {
      setUserDetailsToSocket(socket.handshake.auth.token, socket.id);
    })

    // After a person hits join room button the request is catched here. Here the request is sent only to the owner of the room
    socket.on(JOIN_ROOM_REQUEST, (data) => {
      const { roomId } = data;

      const roomDetails = globalState.getRoomDetailsById(roomId);

      const ownerUserId = roomDetails['owner'];
      const ownerSocketId = globalState.getSocketByUserId(ownerUserId)['socketId'];

      // send his/her join request to the owner
      // sending message to owner of the room
      const { userId, email } = getUserDetails(socket.handshake.auth.token);
      const username = email.split('@')[0];

      socket.to(ownerSocketId).emit(JOIN_ROOM_REQUEST, { userId, username });
    })

    // After accepting the person the request is sent to the server and caught here. Moreover, we should send the admitted person details to all members in the group
    // If not accepted we need to let the user who wants to play know that he/she was denied by owner.
    socket.on(ACCEPTED_JOIN_ROOM, (data) => {
      const { roomId, username, userId } = data;

      io.to(roomId).emit(ACCEPTED_JOIN_ROOM, { username, userId });
    })

    socket.on(DENY_REQUEST, (data) => {
      const { roomId, username } = data;

      io.to(roomId).emit(DENY_REQUEST, { username });
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected with id: ' + socket.id);
    })

  })
}