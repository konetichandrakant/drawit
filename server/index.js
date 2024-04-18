const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const server = http.createServer(app);
const { authRouter } = require('./src/routes/authRoutes');
const { otherRouter } = require('./src/routes/otherRoutes');
const { gameRouter } = require('./src/routes/gameRoutes');

require('dotenv').config();
const MONGODB_URL = process.env.MONGODB_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  next();
})
app.use(express.json());

app.use(authRouter);
app.use(otherRouter);
app.use(gameRouter);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL).then(() => { console.log('Connected to MongoDB!!') });
  } catch (err) {
    console.log(err);
  }
}

start();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});