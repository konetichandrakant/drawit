const User = require('../models/User');

const { JOIN_ROOM_REQUEST, ACCEPTED_JOIN_ROOM, REMOVE_USER, DENY_REQUEST, EXIT_ROOM, GET_ALL_DATA, REMOVED, CREATE_ROOM, START_GAME, DELETE_ROOM } = require('../utils/constants');
const globalState = require('../utils/globalState');
const socketUtils = require('../socket/socketUtils');

require('dotenv').config();

exports.roomSocket = (io) => {

	io.on('connection', (socket) => {
		console.log('socket connected id: ' + socket.id);

		socket.on(CREATE_ROOM, (data) => {
			const { roomId } = data;
			const { userId } = socketUtils.getUserDetails(socket.handshake.auth.token);

			// add owner to room
			socketUtils.addUserToRoom({ userId, roomId, socketId: socket.id, owner: true });

			socket.join(roomId);
		})

		// After client hits join room button the request is catched here. Here the request is sent only to the owner of the room
		socket.on(JOIN_ROOM_REQUEST, (data) => {
			const { roomId } = data;
			const { userId } = socketUtils.getUserDetails(socket.handshake.auth.token);

			if (socketUtils.isUserPresentInRoom({ userId, roomId })) {
				socket.join(roomId);
				socketUtils.updateUserSocketDetails({ userId, socketId: socket.id });

				const roomDetails = globalState.getRoomDetailsById(roomId);

				socket.emit(GET_ALL_DATA, {
					owner: globalState.getUserDetailsById(roomDetails['owner'])['username'],
					others: socketUtils.getUserDetailsListFromUserIdsList(roomDetails['userApprovedConnections'])
				});
			} else if (socketUtils.isUserPresentInRoomConnection({ userId, roomId })) {
				socketUtils.updateUserSocketDetails({ userId, socketId: socket.id });
			} else {
				socketUtils.addUserToRoomConnection({ userId, roomId, socketId: socket.id });

				const roomDetails = globalState.getRoomDetailsById(roomId);
				const ownerSocketId = globalState.getUserDetailsById(roomDetails['owner'])['socketId'];

				// send his/her join request to the owner
				// sending message to owner of the room
				socket.to(ownerSocketId).emit(JOIN_ROOM_REQUEST, { userId, username: globalState.getUserDetailsById(userId)['username'] });
			}
		})

		// After accepting the person the request is sent to the server and caught here. Moreover, we should send the admitted person details to all members in the group
		// If not accepted we need to let the user who wants to play know that he/she was denied by owner.
		socket.on(ACCEPTED_JOIN_ROOM, (data) => {
			const { roomId, userId } = data;
			const roomDetails = globalState.getRoomDetailsById(roomId);

			// Add user into room
			socketUtils.addUserToRoom({ userId, roomId });

			const acceptedUserSocketId = globalState.getUserDetailsById(userId)['socketId'];

			// Optimised to send all user details to only acceptedUsers
			socket.to(acceptedUserSocketId).emit(GET_ALL_DATA, {
				owner: globalState.getUserDetailsById(roomDetails['owner'])['username'],
				others: socketUtils.getUserDetailsListFromUserIdsList(roomDetails['userApprovedConnections'])
			});

			// Send accepted user to all members in the room
			io.to(roomId).emit(ACCEPTED_JOIN_ROOM, { username: globalState.getUserDetailsById(userId)['username'], userId });

			// Join socket to room
			const targetSocket = io.sockets.get(acceptedUserSocketId);

			if (!targetSocket)
				return;

			targetSocket.join(roomId);
		})

		socket.on(DENY_REQUEST, (data) => {
			const { userId, roomId } = data;

			const deniedUserSocketId = globalState.getUserDetailsById(userId)['socketId'];
			socket.to(deniedUserSocketId).emit(DENY_REQUEST);

			socketUtils.denyUserFromRoom({ userId, roomId });
		})

		socket.on(REMOVE_USER, (data) => {
			const { userId, roomId } = data;

			const removingUserSocketId = globalState.getUserDetailsById(userId)['socketId'];
			socket.to(removingUserSocketId).emit(REMOVED);

			socketUtils.removeUserFromRoom({ userId, roomId });

			// // Get socket object 
			// const removingUserSocketObject = io.sockets.get(removingUserSocketId);
			// // Emitting event to removing socket user
			// removingUserSocketObject.emit(REMOVED);

			io.to(roomId).emit(REMOVE_USER, { userId });
		})

		// come back
		socket.on(EXIT_ROOM, (data) => {
			const { roomId } = data;
			const { userId } = socketUtils.getUserDetails(socket.handshake.auth.token);

			socketUtils.exitFromRoom({ userId, roomId });

			// Disconnect the socket
			socket.disconnect();

			io.to(roomId).emit(EXIT_ROOM, { userId });
		})

		socket.on(DELETE_ROOM, (data) => {
			const { roomId } = data;

			io.to(roomId).emit(DELETE_ROOM);

			const requestingUsersSocketIds = socketUtils.getRequestingUsersSocketDetails({ roomId });
			for (let i = 0; i < requestingUsersSocketIds.length; i++) {
				socket.to(requestingUsersSocketIds[i]).emit(DELETE_ROOM);
			}

			// delete all room users after sending to the sockets of the room
			socketUtils.deleteRoom({ roomId });
		})

		socket.on(START_GAME, (data) => {
			const { roomId } = data;
			io.to(roomId).emit(START_GAME);
		})

		socket.on('disconnect', () => {
			console.log('socket disconnected with id: ' + socket.id);
		})

	})
}

// TODO: Add additional feature to not expose userId to customers on client side
// Correct every communication and rectify errors
// Also, create a username field before entering into room ----> done in other way