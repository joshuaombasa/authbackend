const jwt = require('jsonwebtoken')

const secretKey = 'ombasaJoshua'

function createToken(user) {
    const payload = {
        id: user.id,
        email: user.email
    }

    return jwt.sign(payload, secretKey, {expiresIn : '1h'}) // Token expires in 1 hour
}

module.exports = createToken