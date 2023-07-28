const jwt = require('jsonwebtoken')

const secretKey = 'ombasaJoshua'


function authenticateToken(req, res, next) {
    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing.' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
          }
        
        next()
    })
}

module.exports = authenticateToken