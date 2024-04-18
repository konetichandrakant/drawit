const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const { authRouter } = require('./src/routes/authRoutes');
const { otherRouter } = require('./src/routes/otherRoutes');
const { gameRouter } = require('./src/routes/gameRoutes');
const { validationsRouter } = require('./src/routes/validationRoutes');

require('dotenv').config();
const MONGODB_URL = process.env.MONGODB_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const SERVER_PORT = process.env.SERVER_PORT;

app.use(cors({
  origin: CLIENT_URL
}));

app.use(express.json());

app.use(authRouter);
app.use(otherRouter);
app.use(gameRouter);
app.use(validationsRouter);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL).then(() => { console.log('Connected to MongoDB!!') });
  } catch (err) {
    console.log(err);
  }
}

start();

server.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});