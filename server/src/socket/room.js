const { JOIN_ROOM_REQUEST, ACCEPTED_JOIN_ROOM, REMOVE_USER, DENY_REQUEST, EXIT_ROOM } = require('../utils/constants');
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

  const joinSocketToRoom = (targetSocketId, roomId) => {
    try {
      const targetSocket = io.sockets.sockets[targetSocketId]; // Get target socket object

      if (!targetSocket) {
        // Handle case where target socket is not found
        console.error('Target socket with ID', targetSocketId, 'not found');
        return;
      }

      targetSocket.join(roomId); // Join the target socket to the room
      console.log('Socket with ID', targetSocketId, 'joined room', roomId);
    } catch (err) {
      console.error('Error joining socket to room:', err);
      // Handle errors appropriately
    }
  }

  io.on('connection', (socket) => {
    console.log('socket connected id: ' + socket.id);

    setUserDetailsToSocket(socket.handshake.auth.token, socket.id);

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

      const acceptedUserSocketId = globalState.getSocketByUserId(userId)['socketId'];
      const roomDetails = globalState.getRoomDetailsById(roomId);
      socket.to(acceptedUserSocketId).emit(ACCEPTED_JOIN_ROOM, { firstLoad: true, data: { owner: roomDetails['owner'], others: roomDetails['users'] } });

      // Send accepted user to all members in the room except owner
      socket.to(roomId).emit(ACCEPTED_JOIN_ROOM, { username, userId });

      // Add user into room
      roomDetails.users.add(userId);
      globalState.setRoomDetailsById(roomId, roomDetails);

      // Join into room
      joinSocketToRoom(acceptedUserSocketId, roomId);
    })

    socket.on(DENY_REQUEST, (data) => {
      const { userId } = data;

      const deniedUserSocketId = globalState.getSocketByUserId(userId)['socketId'];
      socket.to(deniedUserSocketId).emit(DENY_REQUEST, true);

      globalState.deleteSocketByUserId(userId);
    })

    socket.on(REMOVE_USER, (data) => {
      const { userId, roomId } = data;

      io.to(roomId).emit(REMOVE_USER);

      const roomDetails = globalState.getRoomDetailsById(roomId);

      let spliceIndex = -1;
      for (let i = 0; i < roomDetails['users'].length; i++) {
        if (roomDetails['users'][i] === globalState.getSocketByUserId(userId)['username']) {
          spliceIndex = i;
          globalState.deleteSocketByUserId(userId);
          break;
        }
      }

      if (spliceIndex !== -1) {
        const copyRoomDetails = [...roomDetails];
        copyRoomDetails.splice(spliceIndex, 1);

        globalState.setRoomDetailsById(roomId, copyRoomDetails);
      }
    })

    socket.on(EXIT_ROOM, (data) => {
      const { roomId } = data;
      const { userId } = getUserDetails(socket.handshake.auth.token);

      const roomDetails = globalState.getRoomDetailsById(roomId);

      let spliceIndex = -1;
      for (let i = 0; i < roomDetails['users'].length; i++) {
        if (roomDetails['users'][i] === globalState.getSocketByUserId(userId)['username']) {
          spliceIndex = i;
          globalState.deleteSocketByUserId(userId);
          break;
        }
      }

      if (spliceIndex !== -1) {
        const copyRoomDetails = [...roomDetails];
        copyRoomDetails.splice(spliceIndex, 1);

        globalState.setRoomDetailsById(roomId, copyRoomDetails);
      }
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected with id: ' + socket.id);
    })

  })
}