const express = require('express');
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { exitGameController, gameHistoryController, gameDetailsController } = require('../controller/game');
const router = express.Router();

router.delete('/exit-game/:roomId', jwtTokenVerification, exitGameController);

router.get('/games', jwtTokenVerification, gameHistoryController);
router.get('/game/:gameId', jwtTokenVerification, gameDetailsController);

exports.gameRouter = router;