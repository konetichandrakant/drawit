const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('../jwtTokenVerification');
const Game = require('../models/Game');

router.post('/', jwtTokenVerification, (req, res) => {
    res.status(200).json({ message: 'POST request handled successfully' });
});

router.get('/', jwtTokenVerification, (req, res) => {
    res.status(200).json({ message: `GET request for ID ${roomId} handled successfully` });
});

module.exports = router;
