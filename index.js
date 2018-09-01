const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const users = require('./routes/users');
const records = require('./routes/records');
const bodyParser = require('body-parser');
mongoose.connect(config.database);

// DB Connected
mongoose.connection.on('connected', () => {
    console.log("Connected to database");
});

// DB Error
mongoose.connection.on('error', () => {
    console.log("Database error");
})

const app = express();

// Port
const port = 3300;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', users);
app.use('/records', records);

// Index
app.get('/api', (req, res) => {
    res.json({
        message: 'Selamat datang di DataSehat'
    })
});

// Start Server
app.listen(port, () => console.log('Server started on port ' + port));
