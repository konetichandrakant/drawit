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

// exports.userDetails = {};
// {
//   userId: socketId, username, roomId
// }

class Details {
  constructor() {
    if (!Details.instance) {
      this.gameDetails = {};
      this.roomDetails = {};
      this.userDetails = {};

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

  getUserDetailsById(userId) {
    return this.userDetails[userId];
  }

  setUserDetailsById(userId, details) {
    this.userDetails[userId] = details;
  }

  isUserPresent(userId) {
    return userId in this.userDetails;
  }

  deleteUserByUserId(userId) {
    delete this.userDetails[userId];
  }

}

const detailsObject = new Details();

module.exports = detailsObject;