const jwt = require('jsonwebtoken');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const jwtTokenVerification = async (req, res, next) => {
    try {
        const token = jwt.verify(req.cookies.token, JWT_SECRET_KEY);
        const user = await User.findById(token.id);
        if (!user)
            return res.status(404);
        req._id = token.id;
        next();
    } catch (error) {
        return res.status(404);
    }
}

module.exports = jwtTokenVerification;