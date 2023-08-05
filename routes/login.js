const express = require('express')
const mysql = require('mysql')
const bcrypt = require('bcrypt')

const createToken = require('../createToken')

const router = express.Router()

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'auth'
})

router.post('/', (req, res) => {
    const { email, password } = req.body

    const sql = `SELECT * FROM user WHERE email = ?`

    connection.query(
        sql,
        [email, password],
        (error, results) => {
            if (error) {
                res.send(error)
            } else {

                if (results.length > 0) {

                    bcrypt.compare(password, results[0].password, (error, isEqual) => {
                        if (isEqual) {
                            const payload = {
                                email: email,
                                password: password
                            }
                            const token = createToken.createToken(payload)
                            res.json({ message: 'Login successful', token: token })
                        } else {
                            res.status(401).json({ message: 'Invalid credentials.' });
                        }
                    })

                } else if (results.length === 0) {
                    res.status(401).json({ message: 'User with this email does not exist' })
                }
            }
        }
    )
})

module.exports = router