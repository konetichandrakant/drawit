const express = require('express');
const router = express.Router();
const jwtTokenVerification = require('../middleware/jwtTokenVerification');
const { profileController, homeController } = require('../controller/others');

router.get('/user', jwtTokenVerification, profileController);
router.get('/home', jwtTokenVerification, homeController);

exports.otherRouter = router;