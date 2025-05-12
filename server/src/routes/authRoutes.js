const express = require('express');
const router = express.Router();
const { loginController, logoutController, registerController } = require('../controller/auth');

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', logoutController);

exports.authRouter = router;