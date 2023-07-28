const express = require('express')

const cors = require('cors')

const mysql = require('mysql')

const app = express()

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

    const sql = `INSERT INTO user (first_name, last_name,  email, password ) VALUES( ?, ?, ?,?) `

    connection.query(
        sql,
        [firstname, laststname, email, password],
        (error, results) => {
            if (error) {
                res.send(error)
            } else {
                res.send('Account created successfully!')
            }
        }
    )

})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})