const jwt = require('jsonwebtoken');
const User = require('./models/User');
const keys = require('./keys');

const JWT_SECRET_KEY = keys.JWT_SECRET_KEY;

const jwtTokenVerification = async (req, res, next) => {
    console.log(req.body.token, 'jwtAuth');
    try {
        if (!req.body.token)
            return res.status(404).send(false);
        const token = jwt.verify(req.body.token, JWT_SECRET_KEY);
        const user = await User.findById(token);
        if (!user)
            return res.status(404).send(false);
        req.id = token;
        next();
    } catch (error) {
        return res.status(404);
    }
}

module.exports = jwtTokenVerification;