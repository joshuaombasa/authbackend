const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const mysql = require('mysql')

const app = express()

const createToken = require('./createToken')

const secretKey = 'ombasaJoshua'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'auth'
})

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.send({ message: 'Server running ok' })
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
                if (results.length) {
                    return res.status(409).json({ message: 'User with this email already exists' });
                } else {

                    const sql = `INSERT INTO user (first_name, last_name,  email, password ) VALUES( ?, ?, ?,?) `

                    connection.query(
                        sql,
                        [firstname, laststname, email, password],
                        (error, result) => {
                            if (error) {
                                res.send(error)
                            } else {
                                // res.send({message : 'Account created successfully!'})
                                const userId = result.insertId; // Get the ID of the newly inserted user

                                // Generate a JWT token for the registered user using their ID
                                const token = jwt.sign({ userId, firstname, email }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
                            
                                // The registration was successful, and the user was added to the database
                                res.json({ message: 'Registration successful.', token });
                            }
                        }
                    )
                }
            }
        }
    )

    



})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})