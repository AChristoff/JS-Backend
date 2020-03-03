const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
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
    tags: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Tag'
    }],
});

module.exports = mongoose.model('Image', imageSchema);