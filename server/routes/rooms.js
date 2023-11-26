const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('../jwtTokenVerification');
const roomIds= require('../misc/roomIds');

router.post('/new', jwtTokenVerification, (req, res) => {
    const userId = req.id;

    if(roomIds.length===0)
        return res.status(500);

    
    res.status(200).send({ message: 'Game room created successfully' });
});

router.post('/enter', jwtTokenVerification, (req, res) => {
    const userId = req.id;
    res.status(200).json({ message: 'Entered the game room successfully' });
});

module.exports = router;
