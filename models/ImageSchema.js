const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  description: {
    type: String,
  },
  tags: {
    type: [Schema.type.ObjectId],
    required: true
  }
});

module.exports = mongoose.model('Image', imageSchema);