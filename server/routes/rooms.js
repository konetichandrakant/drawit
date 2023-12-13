const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('../jwtTokenVerification');
const roomIds = require('../store/roomIds');

router.post('/new', jwtTokenVerification, (req, res) => {
    const userId = req.id;

    if (roomIds.length === 0)
        return res.status(500);

    const roomId = roomIds.pop();
    res.status(200).send({ roomId });
});

router.post('/enter/:roomId', jwtTokenVerification, (req, res) => {
    const userId = req.id;
    const { roomId } = req.params;
    res.status(200).send();
});

router.post('/play/:roomId', jwtTokenVerification, (req, res) => {
    const userId = req.id;
    const { roomId } = req.params;
    res.status(200).send();
})

router.post('/end/:roomId', jwtTokenVerification, (req, res) => {
    const userId = req.id;
    const { roomId } = req.params;
    return res.status(200).send();
})

module.exports = router;
