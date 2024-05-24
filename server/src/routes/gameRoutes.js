const express = require('express');
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { gameHistoryController, gameDetailsController } = require('../controller/game');
const router = express.Router();

router.get('/games', jwtTokenVerification, gameHistoryController);
router.get('/game/:gameId', jwtTokenVerification, gameDetailsController);

exports.gameRouter = router;