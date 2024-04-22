const express = require('express');
var app = require('express')();
var http = require('http').Server(app);
const mongoose = require('mongoose');
const cors = require('cors');
const { authRouter } = require('./src/routes/authRoutes');
const { otherRouter } = require('./src/routes/otherRoutes');
const { gameRouter } = require('./src/routes/gameRoutes');
const { validationsRouter } = require('./src/routes/validationRoutes');
const { gameSocket } = require('./src/socket/game');
const { roomSocket } = require('./src/socket/room');
require('dotenv').config();

const io = require('socket.io')(parseInt(process.env.SOCKET_PORT), {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST']
  }
});

gameSocket(io);
roomSocket(io);

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json());

app.use(authRouter);
app.use(otherRouter);
app.use(gameRouter);
app.use(validationsRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL).then(() => { console.log('Connected to MongoDB!!') });
  } catch (err) {
    console.log(err);
  }
}

start();

http.listen(parseInt(process.env.SERVER_PORT), () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});