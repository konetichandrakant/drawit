const express = require('express');
const jwtTokenVerification = require('../middleware/jwtTokenVerification');
const { getGameDetails, postGameDetails } = require('../controller/game');
const router = express.Router();

router.get('/game/:id', jwtTokenVerification, getGameDetails);
router.post('/game', jwtTokenVerification, postGameDetails);