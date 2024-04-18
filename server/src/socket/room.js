const { JOIN_ROOM_REQUEST, ACCEPTED_JOIN_ROOM, ERROR } = require('../../../utils/enum');
const { globalState } = require('../../utils/globalState');
const jwt = require('jsonwebtoken');

let io;

exports.roomSocket = (server) => {
  io = require('socket.io')(server);
  io = io.of('/room');

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

  io.on('connection', (socket) => {

    // After a person hits join room button the request is catched here. Here the request is sent only to the owner of the room
    socket.on(JOIN_ROOM_REQUEST, (data) => {
      const { userId, email } = socket.userDetails;
      const { roomId } = data;

      // send his/her join request to the owner
      const roomDetails = globalState.getRoomDetailsById(roomId);

      if (userId in roomDetails) {
        return socket.emit(ERROR, { message: 'You are already logged in different browser/tab please have a look at it!!' });
      }

      // sending message to owner of the room
      const ownerUserId = roomDetails['owner'];
      const ownerSocketId = socketDetails[ownerUserId];

      io.sockets.to(ownerSocketId).emit(JOIN_ROOM_REQUEST, { userId, message: 'The user with email ' + email + ' wants to join the room' });
    })

    // After accepting the person the request is sent to the server and caught here. Moreover, we should send the admitted person details to all members in the group
    // If not accepted we need to let the user who wants to play know that he/she was denied by owner.
    socket.on(ACCEPTED_JOIN_ROOM, (data) => {
      const { roomId, email } = data;
      // remove @gmail.com from the username
      const username = email.split('@')[0];

      io.to(roomId).emit(ACCEPTED_JOIN_ROOM, { username });
    })

  })
}