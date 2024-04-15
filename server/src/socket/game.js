const { getNextLevelDrawingItem } = require('../../utils/gameFunctionality');
const { UPDATE_LEADERBOARD, NEXT_LEVEL } = require('../../../utils/enum');
const globalInstance = require('../../utils/globalState');
const jwt = require('jsonwebtoken');

// {roomId:{levels:[[{"user1":"","score":""},{"user2":"",...}],[...]]}}
// {roomId: [usersWithTheirUserId]}
// {userId: userSocketId}

let io;

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