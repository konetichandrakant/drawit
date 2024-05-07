const { UPDATE_LEADERBOARD, NEXT_LEVEL } = require('../utils/constants');
const { globalState } = require('../utils/globalState');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.gameSocket = (io) => {

  io.use((socket, next) => {
    try {
      const token = socket.auth.token;

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

  io.of('/game').on('connection', (socket) => {

    console.log('socket connected with id: ' + socket.id);

    socket.on(NEXT_LEVEL, (data) => {
      const { userId } = socket.userDetails;
      const { roomId } = data;

      const nextLevelDetails = getNextLevelDrawingItem({ gameDetails: globalState.getGameDetailsById(roomId), userId });

      return socket.emit(NEXT_LEVEL, { drawingItem: nextLevelDetails });
    })

    socket.on(UPDATE_LEADERBOARD, (data) => {
      const { roomId, userId, score, level } = data;

      const gameDetails = globalState.getRoomDetailsById(roomId);
      gameDetails[level]['usersInformation'][userId] = score;

      io.to(roomId).emit(UPDATE_LEADERBOARD, { userId, score });
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected with id: ' + socket.id);
    })

  })
}

const getNextLevelDrawingItem = ({ gameDetails, userId }) => {

  for (let levelInformation in gameDetails['levelInformation']) {
    if (!(userId in levelInformation['usersInformation'])) {
      return { valid: true, drawingItem: levelInformation['usersInformation']['drawingItem'] };
    }
  }

  let excludeDrawings = [];
  gameDetails['levelInformation'].map((info) => { excludeDrawings.push(info['drawingItem']) })

  // Random drawing item which is not given to any player
  while (true) {
    const randIndex = (drawItems.length * Math.random()) % drawItems.length;
    drawing = drawItems[randIndex];
    if (!(drawing in excludeDrawings)) {
      return drawing;
    }
  }
}

// As of now, game is developed in such a way that it uses only one socket connection to connect and rooms are created
// In future more optimised version will come with better speed and scalability
// At present, I came up with a solution which does not have refresh feature and also if their is network interruption this does not works fine in some areas
// In future, I will also address these above issues to make this more reliable and scalable with whatever best features I can come up I will definitely bring up
// And doodlenet classifier is on client side as of which frontend part becomes heavy and it can take up good amount of time and makes client side a bit slow and memory might be eaten up because of network which needs to share the calssifier for every client