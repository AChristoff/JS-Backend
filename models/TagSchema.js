const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now,
    required: true
  },
})

module.exports = mongoose.model('Tag', TagSchema);
