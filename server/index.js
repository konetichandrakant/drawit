const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const MONGODB_URL = process.env.MONGODB_URL;
const User = require('./models/User');
const UserAuth = require('./models/UserAuth');

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

app.listen(8080);