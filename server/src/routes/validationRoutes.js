const express = require('express');
const router = express.Router();
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');

router.get('/valid-room/:roomId', jwtTokenVerification, validRoomController);
router.get('/game-room/:roomId', jwtTokenVerification, validGameController);

exports.authRouter = router;