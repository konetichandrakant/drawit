const { generateRoomId, getNextLevelDrawingItem } = require('../../utils/gameFunctionality');
const { CREATE_ROOM, JOIN_ROOM_REQUEST, ACCEPTED_JOIN_ROOM, START_GAME, UPDATE_LEADERBOARD, NEXT_LEVEL, END_GAME, ERROR } = require('../../../utils/enum');
const globalInstance = require('../../utils/globalState');
const jwt = require('jsonwebtoken');

// {roomId:{levels:[[{"user1":"","score":""},{"user2":"",...}],[...]]}}
// {roomId: [usersWithTheirUserId]}
// {userId: userSocketId}

let io;

exports.roomSocket = (server) => {
  io = require('socket.io')(server);
  io = io.of('/room');

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token && !token.startsWith('Bearer ')) {
        return new Error('Invalid token');
      }
      try {
        const authToken = authHeader.substring(7);
        if (!authToken)
          return new Error('Invalid token');
        socket.userDetails = jwt.verify(authToken, JWT_SECRET_KEY);
        next();
      } catch {
        return new Error('Invalid token');
      }
    } catch (err) {
      return err;
    }
  });

  io.on('connection', (socket) => {

    // Just after connecting we need to
    // Here we should keep in mind who created room and keep a storage for who is the owner of this room
    socket.on(CREATE_ROOM, (data) => {
      const { userId } = socket.userDetails;

      const generatedRoomId = generateRoomId({ roomDetails: globalInstance.getAllRoomDetails() });
      socket.join(generatedRoomId);

      globalInstance.setRoomDetailsById(generateRoomId, { 'owner': userId, 'users': [{ userId: true }] });

      socket.emit({ roomId: generateRoomId, message: 'Room created!!' });
    })

    // After a person hits join room button the request is catched here. Here the request is sent only to the owner of the room
    socket.on(JOIN_ROOM_REQUEST, (data) => {
      const { userId, email } = socket.userDetails;
      const { roomId } = data;

      // send his/her join request to the owner
      const roomDetails = globalInstance.getRoomDetailsById(roomId);

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

      io.to(roomId).emit(ACCEPTED_JOIN_ROOM, { message: email + ' was accepted by owner to join the room' });
    })

    socket.on(START_GAME, (data) => {
      const { roomId } = data;

      io.to(roomId).emit(START_GAME, { message: 'Owner of the room started the game!!' });
    })

  })
}

exports.gameSocket = (server) => {
  io = require('socket.io')(server);
  io = io.of('/game');

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token && !token.startsWith('Bearer ')) {
        return new Error('Invalid token');
      }
      try {
        const authToken = authHeader.substring(7);
        if (!authToken)
          return new Error('Invalid token');
        socket.userDetails = jwt.verify(authToken, JWT_SECRET_KEY);
        next();
      } catch {
        return new Error('Invalid token');
      }
    } catch (err) {
      return err;
    }
  });

  io.on('connection', (socket) => {

    socket.on(NEXT_LEVEL, (data) => {
      const { userId } = socket.userDetails;
      const { roomId } = data;

      const nextLevelDetails = getNextLevelDrawingItem({ gameDetails: globalInstance.getGameDetailsById(roomId), userId });

      return socket.emit(NEXT_LEVEL, { message: 'Game completed please wait for results or exit the page to move to home screen and play new game' });;
    })

    socket.on(UPDATE_LEADERBOARD, (data) => {
      const { roomId, userId, score, level } = data;

      const gameDetails = globalInstance.getRoomDetailsById(roomId);
      gameDetails[level]['usersInformation'][userId] = score;

      io.to(roomId).emit(UPDATE_LEADERBOARD, { userId, score });
    })

    socket.on(END_GAME, (data) => {

    })

    socket.on('disconnect', (data) => {
      console.log('user disconnected with details: ', data);
    })

  })
}

// As of now, game is developed in such a way that it uses only one socket connection to connect and rooms are created
// In future more optimised version will come with better speed and scalability
// At present, I came up with a solution which does not have refresh feature and also if their is network interruption this does not works fine in some areas
// In future, I will also address these above issues to make this more reliable and scalable with whatever best features I can come up I will definitely bring up
// And doodlenet classifier is on client side as of which frontend part becomes heavy and it can take up good amount of time and makes client side a bit slow and memory might be eaten up because of network which needs to share the calssifier for every client