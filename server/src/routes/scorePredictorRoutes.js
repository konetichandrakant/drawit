const express = require('express');
const router = express.Router();

const { jwtTokenVerification } = require('../middleware/jwtTokenVerification');
const { scorePredictor } = require('../controller/scorePredictor');

router.post('/score', jwtTokenVerification, scorePredictor);

exports.otherRouter = router;