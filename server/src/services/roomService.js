const globalState = require('../utils/globalState');
const { EXIT_GAME } = require('../utils/constants');

exports.removeUserFromGame = (userId, roomId) => {
    const gameRoomDetailsById = globalState.getGameDetailsById(roomId);

    if (gameRoomDetailsById !== null && gameRoomDetailsById['users'] !== null && gameRoomDetailsById['users'][userId] !== null) {
        gameRoomDetailsById['users'][userId].playing = EXIT_GAME;
        globalState.deleteUserByUserId(userId);
    }
}

exports.removeUserFromRoom = (userId, roomId) => {
    const roomDetails = globalState.getRoomDetailsById(roomId);

    if (roomDetails !== null) {
        for (let i = 0; i < roomDetails['users'].length; i++) {
            if (roomDetails['users'][i] === userId) {
                roomDetails['users'].splice(i, 1);
                globalState.setRoomDetailsById(roomId, roomDetails);
                globalState.deleteUserByUserId(userId);
            }
        }
    }

    // This block will execute if we cannot find user in room
    globalState.deleteUserByUserId(userId);
}

exports.removeRoom = (roomId) => {
    // delete users of the room

    globalState.deleteRoomDetailsById(roomId);
}

exports.removeGame = (roomId) => {
    globalState.deleteGameDetailsById(roomId);
}