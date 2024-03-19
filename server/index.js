const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const server = http.createServer(app);
const dotenv = require('dotenv');

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;

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
  } catch (err) {
    console.log(err);
  }
}

start();

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});