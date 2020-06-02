const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const {connectionString, port} = require('./config/environment');
const initializeDataBase = require('./config/database');
const CORS = require('./config/cors');
const interceptor = require('./middleware/interceptor');
const app = express();

initializeDataBase(connectionString);
CORS(app);

app.use(bodyParser.json());

interceptor(app);

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