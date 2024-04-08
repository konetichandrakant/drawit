const express = require('express');
const router = express.Router();
const { loginController, registerController } = require('../controller/auth');

router.post('/login', loginController);
router.post('/register', registerController);

exports.authRouter = router;