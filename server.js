const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()

const bcrypt = require('bcrypt')

const authenticateToken = require('./authenticateToken')

const mysql = require('mysql')

const createToken = require('./createToken')

const app = express()

const secretKey = process.env.JWT_SECRET

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'auth'
})

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send({ message: 'Server running ok' })
})

app.get('/protected', authenticateToken.authenticateToken, (req, res) => {
    res.send({ message: 'Welcome to private members club' })
})

app.post('/signup', (req, res) => {

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

app.post('/login', (req, res) => {

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

app.get('/admin', authenticateToken.authenticateToken, async(req, res) => {
    const sql = `SELECT * FROM user`

    try {
        const results = connection.query(sql)
        if(results) {
            res.send(results)
        } else {
            res.send({message : 'No user exists'})
        }
    } catch(error) {
        res.send(error)
    }
})

app.listen(4000, () => {
    console.log('Server running on port 4000')
})