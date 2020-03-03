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
  images: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Image',
  }]
});

module.exports = mongoose.model('Tag', TagSchema);
