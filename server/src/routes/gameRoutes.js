const express = require('express');
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { createRoomController, exitGameController, gameHistoryController, gameDetailsController } = require('../controller/game');
const router = express.Router();

router.get('/create-room', jwtTokenVerification, createRoomController);
router.delete('/exit-game/:roomId', jwtTokenVerification, exitGameController);

router.get('/games', jwtTokenVerification, gameHistoryController);
router.get('/game/:gameId', jwtTokenVerification, gameDetailsController);

exports.gameRouter = router;