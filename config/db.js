const mongoose = require('mongoose');

const conectionString = 'mongodb://localhost:27017/js_backend_ex_3';

module.exports = mongoose.connect(conectionString);