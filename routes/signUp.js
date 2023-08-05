const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const mysql = require('mysql')

const createToken = require('../authenticateToken')

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'auth'
})

router.post('/', (req, res) => {

    const { firstname, laststname, email, password } = req.body

    const checkSql = 'SELECT user_id FROM user WHERE email = ?'

    connection.query(
        checkSql,
        [email],
        (error, results) => {
            if (error) {
                res.send(error)
            } else {
                if (results.length > 0) {
                    return res.status(409).json({ message: 'User with this email already exists' });
                } else {
                    bcrypt.hash(password, 10, (error, hash) => {

                        const sql = `INSERT INTO user (first_name, last_name,  email, password ) VALUES( ?, ?, ?,?) `

                        connection.query(
                            sql,
                            [firstname, laststname, email, hash],
                            (error, result) => {
                                if (error) {
                                    res.send(error)
                                } else {

                                    const userId = result.insertId;

                                    const payload = {
                                        userId: userId,
                                        firstname: firstname,
                                        email: email
                                    }

                                    const token = createToken.createToken(payload)

                                    res.json({ message: 'Registration successful.', token });
                                }
                            }
                        )
                    })
                }
            }
        }
    )

})

module.exports = router