const jwt = require('jsonwebtoken')

const secretKey = process.env.JWT_SECRET

module.exports = {
    authenticateToken: authenticateToken
}



function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing.' });
    } else if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token.' });
            }

            next();
        });
    }
}