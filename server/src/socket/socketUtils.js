const User = require('../models/User');

const jwt = require('jsonwebtoken');
const globalState = require('../utils/globalState');

require('dotenv').config();

exports.getUserDetails = (token) => {
    if (!token || !token.startsWith('Bearer ')) {
        return next(new Error('Invalid token format')); // More specific error message
    }

    const authToken = token.substring(7); // Assuming token format is "Bearer <token>"
    return jwt.verify(authToken, process.env.JWT_SECRET_KEY);
}

exports.setUserDetailsToSocket = async (token, socketId) => {

    if (!token || !token.startsWith('Bearer ')) {
        return next(new Error('Invalid token format')); // More specific error message
    }

    const authToken = token.substring(7); // Assuming token format is "Bearer <token>"
    const { userId } = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    const { username } = await User.findById(userId, { username: 1 });

    globalState.setUserDetailsById(userId, { username, socketId });
}

exports.userPresentInRoom = (roomId, userId) => {
    const roomDetails = globalState.getRoomDetailsById(roomId);

    for (let i = 0; i < roomDetails['users'].length; i++) {
        if (roomDetails['users'][i] === userId) {
            return true;
        }
    }

    return false;
}

exports.removeUserFromRoom = (socketId, socketObj, roomId) => {

}

exports.addUserToRoom = (socketId, io, roomId) => {
    try {
        const targetSocket = io.sockets.get(socketId);

        if (!targetSocket)
            return;

        targetSocket.join(roomId);
    } catch (err) {
        console.error('Error joining socket to room:', err);
    }
}

exports.disconnectUserSocket = (socketId, socketObj) => {

}

exports.getUserDetailsListFromUserIdsList = (userIdsList) => {
    return userIdsList.map((userId) => { return { userId, username: globalState.getUserDetailsById(userId)['username'] } });
}