const express = require('express');
const dotenv = require('dotenv');
const app = express();
const tokenVerification = require('./jwtTokenVerification');

app.post('/login', (req, res) => {
  const _id = req.id;
})

app.post('/register', (req, res) => {
  const _id = req.id;
})

app.post('/', tokenVerification, (req, res) => {
  const _id = req.id;
})

app.get('/profile', tokenVerification, (req, res) => {
  const _id = req.id;
})