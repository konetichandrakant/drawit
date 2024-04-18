const express = require('express');
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { getRoomIdController, getGameDetailsController, postGameDetailsController } = require('../controller/game');
const router = express.Router();

router.get('/create-room', jwtTokenVerification, getRoomIdController)
router.get('/game/:id', jwtTokenVerification, getGameDetailsController);
router.post('/game', jwtTokenVerification, postGameDetailsController);

exports.gameRouter = router;