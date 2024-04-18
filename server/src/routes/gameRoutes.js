const express = require('express');
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { createRoomController, postGameDetailsController, exitGameController, stopGameController } = require('../controller/game');
const router = express.Router();

router.get('/create-room', jwtTokenVerification, createRoomController);
router.post('/game/:gameId', jwtTokenVerification, postGameDetailsController);
router.delete('/game/:roomId/:userId', jwtTokenVerification, exitGameController);
router.delete('/game/:roomId', jwtTokenVerification, stopGameController);

exports.gameRouter = router;