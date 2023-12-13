const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('../jwtTokenVerification');
const Game = require('../models/Game');
const User = require('../models/User');

router.post('/:id', jwtTokenVerification, (req, res) => {
    const userId = req.id;
    return res.status(200).send();
});

router.get('/:id', jwtTokenVerification, (req, res) => {
    res.status(200).send({ message: `GET request for ID ${roomId} handled successfully` });
});

router.post('/', jwtTokenVerification, async (req, res) => {
    const userId = req.id;
    const { score, drawingName } = req.body;
    const game = await Game({ drawingName, score });
    const user = await User.findById(userId);
    user.gameIds.push(game._id);
    await user.save();
    return res.send(true);
})

module.exports = router;
