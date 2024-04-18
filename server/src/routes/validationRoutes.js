const express = require('express');
const router = express.Router();
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');

router.get('/valid-game-room/:roomId', jwtTokenVerification, validGameRoomController);
router.get('/valid-create-room/:roomId', jwtTokenVerification, validCreateRoomController);
router.get('/valid-join-room/:roomId', jwtTokenVerification, validJoinRoomController);

exports.authRouter = router;