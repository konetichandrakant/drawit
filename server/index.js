const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const keys = require('./keys');
const enums = require('../enum');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const roomIds = [];
const roomInfo = {};
const server = http.createServer(app);
const MONGODB_URL = keys.MONGODB_URL;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  next();
})
app.use(express.json());

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('connected to MONGODB');
    app.use('/game', require('./routes/game'));
    app.use('/', require('./routes/details'));
    for (let i = 1000; i <= 9999; i++)
      roomIds.push(i);
  } catch (err) {
    console.log(err);
  }
}

start();

const changeSocketID = (userId, socketId) => {
  if (roomInfo[userId])
    roomInfo[userId]['socketId'] = socketId;
  else
    roomInfo[userId] = { socketId, roomId: '' };
  return roomInfo[userId];
}

const addRoomId = (userId, roomId) => {
  roomInfo[userId][roomId] = roomId;
  return roomInfo[userId];
}

const room = socketIO(server).of('/room');

room.use(async (socket, next) => {
  try {
    const token = jwt.verify(socket.handshake.auth.token, JWT_SECRET_KEY);
    const user = await User.findById(token.id);
    if (!user)
      new Error('not exist');
    socket.details = changeSocketID(token.id, socket.id);
    next();
  } catch (error) {
    console.log('error');
  }
}).on('connection', (socket) => {

  const details = socket.details;

  socket.on(enums.CREATE_ROOM, (roomId, cb) => {
    socket.join(roomId);
    cb(`Joined ${roomId}`);
  })

  socket.on(enums.JOIN_ROOM, (roomId) => {
    socket.join(roomId);
    addRoomId(details.userId, roomId);
    room.to(roomId).emit(enums.JOIN_ROOM, { userId: details.userId });
  })

  socket.on(enums.LEVEL_SCORE, (data) => {

  })

  socket.on(enums.UPDATE_LEADERBOARD, (data) => {

  })

  socket.on('disconnect', () => {

  })
})

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});