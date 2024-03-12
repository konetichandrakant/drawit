const { generateRoomId } = require('../utils/gameFunctionality');
const { CREATE_ROOM, JOIN_ROOM_REQUEST, ACCEPTED_JOIN_ROOM, START_GAME, UPDATE_LEADERBOARD, END_GAME, DELETE_ROOM, ERROR } = require('../../enum');
const { gameDetails, roomDetails, socketDetails } = require('../utils/globalState');

// {roomId:{levels:[[{"user1":"","score":""},{"user2":"",...}],[...]]}}
// {roomId: [usersWithTheirUsername]}
// {username: userSocketId}

let io;

exports.socketConnection = (server) => {
  io = require('socket.io')(server);

  io.on('connection', (socket) => {

    // Just after connecting we need to

    // Here we should keep in mind who created room and keep a storage for who is the owner of this room
    socket.on(CREATE_ROOM, (data) => {
      const { username } = data;

      const generatedRoomId = generateRoomId({ roomDetails });
      socket.join(generatedRoomId);

      roomDetails[generateRoomId] = [username];
      socketDetails[username] = socket.id;

      socket.emit({ roomId: generateRoomId, message: 'Room created!!' });
    })

    // After a person hits join room button the request is catched here. Here the request is sent only to the owner of the room
    socket.on(JOIN_ROOM_REQUEST, (data) => {
      const { roomId, username } = data;

      // send his/her join request to the owner
      const rDetails = roomDetails[roomId];

      if (username in rDetails) {
        return socket.emit(ERROR, { message: 'You are already logged in different browser/ tab please have a look at it!!' });
      }

      // sending message to owner of the room
      const ownerUsername = rDetails[0];
      const ownerSocketId = socketDetails[ownerUsername];

      io.sockets.to(ownerSocketId).emit(JOIN_ROOM_REQUEST, { username, message: 'The user with username ' + username + ' wants to join the room' });
    })

    // After accepting the person the request is sent to the server and caught here. Moreover, we should send the admitted person details to all members in the group
    // If not accepted we need to let the user who wants to play know that he/she was denied by owner.
    socket.on(ACCEPTED_JOIN_ROOM, (data) => {
      const { roomId, username } = data;
      io.to(roomId).emit(ACCEPTED_JOIN_ROOM, { message: username + ' was accepted by owner to join the room' });
    })

    socket.on(START_GAME, (data) => {
      const { roomId } = data;
      io.to(roomId).emit(START_GAME,{drawingItem});
    })

    socket.on(UPDATE_LEADERBOARD, (data) => {

    })

    socket.on(END_GAME, (data) => {

    })

    socket.on(DELETE_ROOM, (data) => {

    })

    socket.on('disconnect', (data) => {
      console.log('user disconnected with details: ', data);
    })

  })
}