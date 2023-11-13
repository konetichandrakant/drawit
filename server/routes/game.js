const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('../jwtTokenVerification');

const Game = require('../models/Game');

router.post('/new', jwtTokenVerification, (req, res) => {
    const userId = req.id;
    listOfCreatedGameRooms.add(userId);
    res.status(200).json({ message: 'Game room created successfully' });
});

router.post('/enter/:id', jwtTokenVerification, (req, res) => {
    const userId = req.id;
    res.status(200).json({ message: 'Entered the game room successfully' });
});

router.post('/exit/:id', jwtTokenVerification, (req, res) => {
    const userId = req.id;
    res.status(200).json({ message: 'Exited the game room successfully' });
});

router.post('/', jwtTokenVerification, (req, res) => {
    res.status(200).json({ message: 'POST request handled successfully' });
});

router.get('/:id', jwtTokenVerification, (req, res) => {
    res.status(200).json({ message: `GET request for ID ${roomId} handled successfully` });
});

module.exports = router;
