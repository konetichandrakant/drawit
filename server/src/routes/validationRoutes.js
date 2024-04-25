const express = require('express');
const router = express.Router();
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { validCreatedRoomController, validCreatingRoomController, validJoinedRoomController, validJoiningRoomController, validGameRoomController } = require('../controller/validations');

router.get('/valid-creating-room/:roomId', jwtTokenVerification, validCreatingRoomController);
router.get('/valid-created-room/:roomId', jwtTokenVerification, validCreatedRoomController);

router.get('/valid-joining-room/:roomId', jwtTokenVerification, validJoiningRoomController);
router.get('/valid-joined-room/:roomId', jwtTokenVerification, validJoinedRoomController);

router.get('/valid-game-room/:roomId', jwtTokenVerification, validGameRoomController);

exports.validationsRouter = router;