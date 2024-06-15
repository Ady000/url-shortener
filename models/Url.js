const mongoose = require('mongoose');
const shortid = require('shortid'); // Import shortid here

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
        default: shortid.generate, // Use shortid to generate unique short URLs
    },
    ip: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Url', urlSchema);
