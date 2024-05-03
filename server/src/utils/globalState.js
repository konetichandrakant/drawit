// exports.gameDetails = {};
// {
//   roomId: {
//     levelInformation:
//     [
//       {
//         drawingItem: "",
//         userInformation: {
//             "userId": score,
//         }
//       }
//     ]
//   }
// }

// exports.roomDetails = {};
// {
//   roomId: {
//     users: [ userId ]
//     owner: userId
//   }
// }

// exports.socketDetails = {};
// {
//   userId: socketId
// }

class Details {
  constructor() {
    if (!Details.instance) {
      this.gameDetails = {};
      this.roomDetails = {};
      this.socketDetails = {};

      Details.instance = this;
    }

    return Details.instance;
  }

  getRoomDetailsById(roomId) {
    return this.roomDetails[roomId];
  }

  setRoomDetailsById(roomId, data) {
    this.roomDetails[roomId] = data;
  }

  isRoomPresent(roomId) {
    return roomId in this.roomDetails;
  }

  deleteRoomById(roomId) {
    delete this.roomDetails[roomId];
  }

  getGameDetailsById(roomId) {
    return this.gameDetails[roomId];
  }

  setGameDetailsById(roomId, data) {
    this.gameDetails[roomId] = data;
  }

  deleteGameById(roomId) {
    delete this.gameDetails[roomId];
  }

  getSocketByUserId(userId) {
    return this.socketDetails[userId];
  }

  setSocketIdByUserId(userId, socketId) {
    this.socketDetails[userId] = socketId;
  }

  isUserPresent(userId) {
    return userId in this.socketDetails;
  }

  deleteSocketByUserId(userId) {
    delete this.socketDetails[userId];
  }

}

const detailsObject = new Details();

module.exports = detailsObject;