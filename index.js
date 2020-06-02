const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const {connectionString, port} = require('./config/environment');
const initializeDataBase = require('./config/database');

const app = express();

initializeDataBase(connectionString);

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// General error handling
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message});
    next();
});


app.listen(port, () => {
    console.log(`REST API listening on port: ${port}`)
});