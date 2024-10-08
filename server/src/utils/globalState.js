// exports.gameDetails = {
//   roomId: {
//     levels: [
//       {
//         "userId": score,
//       }, {
//         "userId": score,
//       }
//     ],
//     drawings: [
//       "item-1", "item-2"
//     ],
//     users: {
//       "userId": { playing: CONSTANT, totalScore: NUMBER, level: NUMBER }
//     }
//   }
// }

// exports.roomDetails = {
//   roomId: {
//     userApprovedConnections: [ userId ],
//     owner: userId,
//     userRequestingConnections: [ userId ]
//   }
// }

// exports.userDetails = {
//   userId: socketId, username, roomId, approved
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

  deleteRoomDetailsById(roomId) {
    delete this.roomDetails[roomId];
  }

  getGameDetailsById(roomId) {
    return this.gameDetails[roomId];
  }

  setGameDetailsById(roomId, data) {
    this.gameDetails[roomId] = data;
  }

  isGameRoomPresent(roomId) {
    return roomId in this.gameDetails;
  }

  deleteGameDetailsById(roomId) {
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