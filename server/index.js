const app = require('express')();
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const keys = require('./keys');
const enums = require('../enum');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

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
  } catch (err) {
    console.log(err);
  }
}

start();

const io = socketIO(server).of('/room');
const roomIds = {};
const userDetails = {};

io.use(async (socket, next) => {
  try {
    const token = jwt.verify(socket.handshake.auth.token, JWT_SECRET_KEY);
    const userId = token._id;
    const user = await User.findById(userId);
    if (!user) return;
    next();
  } catch (error) {
    console.log('error');
    return;
  }
}).on('connection', async (socket) => {
  socket.on(enums.CREATE_ROOM, (roomId) => {
    for(let i=1000;i<10000;i++){
      if(!roomIds[i]){

      }
    }
  })

  socket.on(enums.JOIN_ROOM, (roomId) => {
    io.to(roomId).emit(enums.JOIN_ROOM, { userId: details.userId });
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