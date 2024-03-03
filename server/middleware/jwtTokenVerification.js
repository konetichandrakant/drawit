const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../keys');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const jwtTokenVerification = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const authToken = req.Authorization.substring(7);
            if (!authToken)
                return res.status(404).send(false);
            req.userId = jwt.verify(authToken, JWT_SECRET_KEY);
            next();
        } catch {
            return res.status(404);
        }
    } else {
        return res.status(404);
    }
}

module.exports = jwtTokenVerification;