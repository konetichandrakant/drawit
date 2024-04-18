const express = require('express');
const router = express.Router();
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { validJoinRoomController, validCreateRoomController, validGameRoomController } = require('../controller/validations');

router.get('/valid-create-room/:roomId', jwtTokenVerification, validCreateRoomController);
router.get('/valid-join-room/:roomId', jwtTokenVerification, validJoinRoomController);
router.get('/valid-game-room/:roomId', jwtTokenVerification, validGameRoomController);

exports.validationsRouter = router;