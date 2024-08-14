const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());
dotenv.config();

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'expense_tracker' // Specify database here or in subsequent queries
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL as id:', db.threadId);
        createUsersTable();
    }
});

// Function to create users table if not exists
function createUsersTable() {
    const createUsersTableQuery = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL
    )`;

    db.query(createUsersTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table created/checked successfully');
        }
    });
}

// User registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if user with email already exists
        const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkUserQuery, [email], async (err, data) => {
            if (err) {
                return res.status(500).json('Internal Server Error');
            }

            if (data.length > 0) {
                return res.status(409).json('User already exists');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert new user
            const insertUserQuery = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
            db.query(insertUserQuery, [email, username, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(400).json('Something went wrong');
                }
                res.status(200).json('User created successfully');
            });
        });
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const findUserQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(findUserQuery, [email], async (err, data) => {
            if (err) {
                return res.status(500).json('Internal Server Error');
            }

            if (data.length === 0) {
                return res.status(404).json('User not found');
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, data[0].password);
            if (!isPasswordValid) {
                return res.status(400).json('Invalid password');
            }

            res.status(200).json('Login successful');
        });
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
