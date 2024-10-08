const User = require('../models/User');
const jwt = require('jsonwebtoken');
const globalState = require('../utils/globalState');

require('dotenv').config();

// JWT token verification
exports.getUserDetails = (token) => {
    if (!token || !token.startsWith('Bearer ')) {
        return next(new Error('Invalid token format')); // More specific error message
    }

    const authToken = token.substring(7); // Assuming token format is "Bearer <token>"
    return jwt.verify(authToken, process.env.JWT_SECRET_KEY);
}

// User and socket functions
exports.setUserDetailsToSocket = async ({ userId, socketId, roomId, approved, owner }) => {
    const userDetails = globalState.getUserDetailsById(userId);

    if (owner) {
        const { username } = await User.findById(userId, { username: 1 });
        globalState.setUserDetailsById(userId, { username, socketId, roomId, approved: true });
    } else if (socketId) {
        globalState.setUserDetailsById(userId, { ...userDetails, socketId, approved: (approved ? true : false) });
    } else {
        globalState.setUserDetailsById(userId, { ...userDetails, approved: (approved ? true : false) });
    }
}

exports.updateUserSocketDetails = ({ userId, socketId }) => {
    const userDetails = globalState.getUserDetailsById(userId);

    globalState.setUserDetailsById(userId, { ...userDetails, socketId });
}

exports.disconnectUserSocket = (socketId) => {

}

// User and room functions
exports.addUserToRoomConnection = ({ userId, roomId, socketId }) => {
    const roomDetails = globalState.getRoomDetailsById(roomId);

    this.setUserDetailsToSocket({ userId, socketId, approved: false });

    let flag = false;
    for (let i = 0; i < roomDetails['userRequestingConnections'].length; i++) {
        if (roomDetails['userRequestingConnections'][i] === userId) {
            flag = true;
            break;
        }
    }

    if (!flag) {
        roomDetails['userRequestingConnections'].push(userId);
    }
}

exports.addUserToRoom = ({ userId, socketId, roomId, owner }) => {
    if (owner) {
        this.setUserDetailsToSocket({ userId, socketId, roomId, owner });

        const initialRoomDetails = { userApprovedConnections: [], userRequestingConnections: [], owner: userId };

        globalState.setRoomDetailsById(roomId, initialRoomDetails);
    } else {
        const roomDetails = globalState.getRoomDetailsById(roomId);

        // change user status to approved
        this.setUserDetailsToSocket({ userId, socketId, roomId, approved: true });

        // remove user from requesting pool
        for (let i = 0; i < roomDetails['userRequestingConnections'].length; i++) {
            if (roomDetails['userRequestingConnections'][i] === userId) {
                roomDetails['userRequestingConnections'].splice(i, 1);
                break;
            }
        }

        let flag = false;
        for (let i = 0; i < roomDetails['userApprovedConnections'].length; i++) {
            if (roomDetails['userApprovedConnections'][i] === userId) {
                flag = true;
                break;
            }
        }

        // add user to 
        if (!flag) {
            roomDetails['userApprovedConnections'].push(userId);
        }
    }
}

exports.isUserPresentInRoom = ({ userId, roomId }) => {
    const userDetails = globalState.getUserDetailsById(userId);

    console.log(userDetails, 'approved validation');

    if (!userDetails || userDetails['roomId'] !== roomId)
        return false;

    return userDetails['approved'] === true;
}

exports.isUserPresentInRoomConnection = ({ userId, roomId }) => {
    const userDetails = globalState.getUserDetailsById(userId);

    console.log(userDetails, 'connection validation');

    if (!userDetails || userDetails['roomId'] !== roomId)
        return false;

    return userDetails['approved'] === false;
}

exports.denyUserFromRoom = ({ userId, roomId }) => {
    globalState.deleteUserByUserId(userId);

    const roomDetails = globalState.getRoomDetailsById(roomId);

    // remove user from requesting pool
    for (let i = 0; i < roomDetails['userRequestingConnections'].length; i++) {
        if (roomDetails['userRequestingConnections'][i] === userId) {
            roomDetails['userRequestingConnections'].splice(i, 1);
            break;
        }
    }
}

exports.removeUserFromRoom = ({ userId, roomId }) => {
    globalState.deleteUserByUserId(userId);

    const roomDetails = globalState.getRoomDetailsById(roomId);

    // remove user from approved pool
    for (let i = 0; i < roomDetails['userApprovedConnections'].length; i++) {
        if (roomDetails['userApprovedConnections'][i] === userId) {
            roomDetails['userApprovedConnections'].splice(i, 1);
            break;
        }
    }
}

exports.exitFromRoom = ({ userId, roomId }) => {
    if (globalState.getUserDetailsById(userId)['approved']) {
        this.removeUserFromRoom({ userId, roomId });
    } else {
        this.denyUserFromRoom({ userId, roomId });
    }
}

exports.deleteRoom = ({ roomId }) => {
    console.log(roomId);
    const requestingUserIds = this.getRequestingUsersIds({ roomId });
    const approvedUserIds = this.getApprovedUsersIds({ roomId });

    // delete each requesting user from the room
    for (let i = 0; i < requestingUserIds.length; i++) {
        globalState.deleteUserByUserId(requestingUserIds[i]);
    }

    // delete each approved user from the room
    for (let i = 0; i < approvedUserIds.length; i++) {
        globalState.deleteUserByUserId(approvedUserIds[i]);
    }

    // Delete owner details
    globalState.deleteUserByUserId(globalState.getRoomDetailsById(roomId)['owner']);

    globalState.deleteRoomDetailsById(roomId);
}

exports.getRequestingUsersIds = ({ roomId }) => {
    return globalState.getRoomDetailsById(roomId)['userRequestingConnections'];
}

exports.getApprovedUsersIds = ({ roomId }) => {
    return globalState.getRoomDetailsById(roomId)['userApprovedConnections'];
}

exports.getRequestingUsersSocketDetails = ({ roomId }) => {
    const requestingUserIds = this.getRequestingUsersIds({ roomId });
    return requestingUserIds.map((userId) => { return globalState.getUserDetailsById(userId)['socketId'] })
}

// Utilities 
exports.getUserDetailsListFromUserIdsList = (userIdsList) => {
    return userIdsList.map((userId) => { return { userId, username: globalState.getUserDetailsById(userId)['username'] } });
}

exports.getAllUsersSocketIdsInConnectionPool = () => {
    globalState.getUserRoomConnectionDetails();
}