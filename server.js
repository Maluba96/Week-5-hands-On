const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bycrypt = require('bycrypt');
const dotenv = require ();

//initiate app
const app = express();

//setting up the middleware
app.use(express.json());
app.use(cors());
dotenv.config();

//creating a connection to the database server

const dbConnect = mysql.createConnection({
    host: ProcessingInstruction.env.DB_HOST,
    user: ProcessingInstruction.env.DB_USER,
    password : ProcessingInstruction.env.DB_PASSWORD
});

//connect to the database server
dbConnect.connect((err) =>{
    if(err) return console.log(err);
    console.log('Connected to the DB Server.')
})

    //create a database
    dbConnect.query('CREATE DATABASE IF NOT EXISTS expense_db', (err) =>{
        if(err) return console.log(err);
        console.log('DB: expense_db successfully created.');

        //select the created database
        dbConnect.query('USE expense_db', (err) =>{
            if(err) return console.log(err);
            console.log('expense_db selected for use.');
    
});
        //create table
        const query = CREATE TABLE IF NOT EXIST users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(50) NOT NULL UNIQUE,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
        ;
        dbConnect.query(query, (err) => {
            if(err) return console.log(err);
            console.log('Table users created successfully')
        });
    });

    //user registration route
> app.post('/api/user/register', async (req, res) => {

})

