const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('./jwtTokenVerification'); // Import your token verification module

const listOfCreatedGameRooms = new Set(); // Use Set instead of an object for storing room IDs
const listOfStartedGameRooms = new Set();

router.post('/new', jwtTokenVerification, (req, res) => {
    const id = req.id; // Correct the variable name to 'id'
    listOfCreatedGameRooms.add(id);
    res.status(200).json({ message: 'Game room created successfully' }); // Add a response for the client
});

router.post('/enter/:id', jwtTokenVerification, (req, res) => {
    const id = req.id;
    // Logic for entering a game room
    res.status(200).json({ message: 'Entered the game room successfully' });
});

router.post('/exit/:id', jwtTokenVerification, (req, res) => {
    const id = req.id;
    // Logic for exiting a game room
    res.status(200).json({ message: 'Exited the game room successfully' });
});

router.post('/', jwtTokenVerification, (req, res) => {
    // Logic for handling general POST requests
    res.status(200).json({ message: 'POST request handled successfully' });
});

router.get('/:id', jwtTokenVerification, (req, res) => {
    const id = req.params.id; // Use req.params to get the parameter from the URL
    // Logic for handling GET requests with an ID parameter
    res.status(200).json({ message: `GET request for ID ${id} handled successfully` });
});

module.exports = router;
