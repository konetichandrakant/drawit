// let instance = null;
// let details = [];

// // {roomId, levels:[[{"user1":"","score":""},{"user2":"",...}],[...]]}

// class GameUtility {
//   constructor() {
//     if (instance) {
//       throw new Error("New Object cannot be created");
//     }
//     instance = this;
//   }

//   getGameDetails() {
//     return details;
//   }

//   setGameDetails(updatedDetails) {
//     details = updatedDetails;
//   }
// }

// let gameDetails = Object.freeze(new GameUtility());

// {
//   roomId: {
//     levelInformation:
//     [
//       {
//         drawingItem: "",
//         usersInformation: [
//           {
//             "username": "u1",
//             "score": 0
//           },
//           {
//             "username": "u2",
//             "score": 1
//           }
//         ]
//       }
//     ]
//   }
// }

class Details {

  constructor() {
    if (Details.instance == null) {
      this.gameDetails = {};
      this.roomDetails = {};
      this.socketDetails = {};

      Details.instance = this;
    }

    return Details.instance
  }

  isRoomPresent(roomId) {
    return roomId in this.roomDetails;
  }

  getRoomDetailsById(roomId) {
    return this.roomDetails[roomId];
  }

  setRoomDetailsById(roomId, data) {
    this.roomDetails[roomId] = data;
  }

  getGameDetailsById(roomId) {
    return this.gameDetails[roomId];
  }

  setGameDetailsById(roomId, data) {
    this.gameDetails[roomId] = data;
  }

  getSocketDetailsById(roomId) {
    return this.socketDetails[roomId];
  }

  setSocketDetailsById(roomId, data) {
    this.socketDetails[roomId] = data;
  }

}

var detailsObject = new Details();
Object.freeze(detailsObject);

export default detailsObject;

// exports.gameDetails = {};
// // {roomId: [usersWithTheirUsername]}
// exports.roomDetails = {};
// // {username: userSocketId}
// exports.socketDetails = {};