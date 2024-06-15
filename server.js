const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid'); // Import shortid here

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/url-shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const Url = require('./models/Url'); // Ensure the Url model is correctly imported

// Create a new short URL
app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        let url = await Url.findOne({ originalUrl });
        if (url) {
            res.json(url);
        } else {
            const shortUrl = shortid.generate();
            url = new Url({ originalUrl, shortUrl, ip });
            await url.save();
            res.status(201).json(url);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Redirect to the original URL
app.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });
        if (url) {
            res.redirect(url.originalUrl);
        } else {
            res.status(404).json({ message: 'URL not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
