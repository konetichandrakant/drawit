const express = require('express');
const router = express.Router();
const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { profileController, homeController, getDrawingItemController } = require('../controller/others');

router.get('/profile', jwtTokenVerification, profileController);
router.get('/home', jwtTokenVerification, homeController);
router.get('/get-drawing-item', jwtTokenVerification, getDrawingItemController);

exports.otherRouter = router;