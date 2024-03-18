const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.jwtTokenVerification = async (req, res, next) => {
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