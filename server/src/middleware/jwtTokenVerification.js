const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.jwtTokenVerification = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const authToken = authHeader.substring(7);
            if (!authToken)
                return res.status(200).send({ invalidUser: true });
            req.userDetails = jwt.verify(authToken, JWT_SECRET_KEY);
            next();
        } catch {
            return res.status(200).send({ invalidUser: true });
        }
    } else {
        return res.status(200).send({ invalidUser: true });
    }
}