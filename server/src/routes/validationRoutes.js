const express = require('express');
const router = express.Router();
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { validCreatedRoomController, validCreatingRoomController, validJoinedRoomController, validJoiningRoomController, validGameRoomController } = require('../controller/validations');
const { createRoomController } = require('../controller/game');

router.get('/valid-creating-room', jwtTokenVerification, validCreatingRoomController, createRoomController);
router.get('/valid-created-room/:roomId', jwtTokenVerification, validCreatedRoomController);

router.get('/valid-joining-room', jwtTokenVerification, validJoiningRoomController);
router.get('/valid-joining-room/:roomId', jwtTokenVerification, validJoiningRoomController);
router.get('/valid-joined-room/:roomId', jwtTokenVerification, validJoinedRoomController);

router.get('/valid-game-room/:roomId', jwtTokenVerification, validGameRoomController);

exports.validationsRouter = router;