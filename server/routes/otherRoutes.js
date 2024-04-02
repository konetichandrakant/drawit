const express = require('express');
const router = express.Router();
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { profileController, homeController, gameHistoryController } = require('../controller/others');

router.get('/profile', jwtTokenVerification, profileController);
router.get('/home', jwtTokenVerification, homeController);
router.get('/games', jwtTokenVerification, gameHistoryController);

exports.otherRouter = router;