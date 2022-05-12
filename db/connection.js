const mysql = require('mysql2')
require('dotenv').config();
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.PASSWORD,
        database: 'employees'
    },
    console.log('Connected to the employees database.')

)
connection.connect(function(err){
    if (err) throw err;
})

module.exports = connection