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

exports.gameDetails = {};
// {roomId: [usersWithTheirUsername]}
exports.roomDetails = {};
// {username: userSocketId}
exports.socketDetails = {};