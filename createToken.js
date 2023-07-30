const jwt = require('jsonwebtoken')

const secretKey = process.env.JWT_SECRET

module.exports = {
    createToken : createToken
}

function createToken(payload) {

    return jwt.sign(payload, secretKey, {expiresIn : '1h'}) // Token expires in 1 hour
}

