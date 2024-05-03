const { JOIN_ROOM_REQUEST, ACCEPTED_JOIN_ROOM, ERROR } = require('../utils/constants');
const globalState = require('../utils/globalState');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.roomSocket = (io) => {

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token || !token.startsWith('Bearer ')) {
        return new Error('Invalid token');
      }

      try {
        const authToken = token.substring(7); // Assuming token format is "Bearer <token>"
        socket.userDetails = jwt.verify(authToken, JWT_SECRET_KEY); // Replace with your secret key
        next();
      } catch {
        return new Error('Invalid token');
      }
    } catch (err) {
      return err;
    }
  });

  io.of('/room').on('connection', (socket) => {

    // const { userId } = socket.userDetails;
    // globalState.setSocketIdByUserId(userId, socket.id);

    console.log('socket connected with id: ' + socket.id);

    // After a person hits join room button the request is catched here. Here the request is sent only to the owner of the room
    socket.on(JOIN_ROOM_REQUEST, (data) => {
      const { userId, email } = socket.userDetails;
      const { roomId } = data;

      const roomDetails = globalState.getRoomDetailsById(roomId);

      const ownerUserId = roomDetails['owner'];
      const ownerSocketId = socketDetails[ownerUserId];

      // send his/her join request to the owner
      // sending message to owner of the room
      socket.to(ownerSocketId).emit(JOIN_ROOM_REQUEST, { userId, message: 'The user with email ' + email + ' wants to join the room' });
    })

    // After accepting the person the request is sent to the server and caught here. Moreover, we should send the admitted person details to all members in the group
    // If not accepted we need to let the user who wants to play know that he/she was denied by owner.
    socket.on(ACCEPTED_JOIN_ROOM, (data) => {
      const { roomId, email } = data;
      // remove @gmail.com from the username
      const username = email.split('@')[0];

      io.to(roomId).emit(ACCEPTED_JOIN_ROOM, { username });
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected with id: ' + socket.id);
    })

  })
}