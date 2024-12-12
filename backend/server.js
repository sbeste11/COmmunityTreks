const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes.'
    },
});

// Apply the rate limiter to all requests
app.use(limiter);

// Helmet with custom CSP configuration
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"], // Only allow content from the same origin
            scriptSrc: [
                "'self'",
                "https://www.googletagmanager.com", // Allow Google Tag Manager
                "https://api.mapbox.com", // Allow Mapbox scripts
                "https://events.mapbox.com", // allow mapbox events
                "https://cdnjs.cloudflare.com",
                "'unsafe-inline'" // Required for some dynamically inserted scripts, but should be avoided if possible
            ],
            styleSrc: [
                "'self'",
                "https://api.mapbox.com", // Allow Mapbox styles
                // "'unsafe-inline'" // Needed for inline styles, use sparingly
            ],
            connectSrc: [
                "'self'",
                "https://api.mapbox.com",
                "https://events.mapbox.com",
                "https://www.googletagmanager.com",
                "https://www.google-analytics.com"
            ],
            workerSrc: ["'self'", "blob:"], // Allow blob URLs for workers
            objectSrc: ["'none'"], // Disallow <object> and <embed>
            frameSrc: ["'none'"], // Block all iframes unless explicitly needed
            fontSrc: ["'self'"], // Allow fonts only from the same origin
        },
    })
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static('public'));

// Endpoint to fetch the Google Tag ID
app.get('/google-tag', (req, res) => {
    const googleTag = process.env.GOOGLE_TAG_ID;
    if (!googleTag) {
        return res.status(500).send('Google Tag Snippet not configured');
    }
    res.send(googleTag); // Send the full snippet as HTML
});


// API route to provide the Mapbox token
app.get('/mapbox-token', (req, res) => {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN; // Fetch token from Config Vars
    if (!mapboxToken) {
        return res.status(500).json({ error: 'Mapbox token is not configured' });
    }
    res.json({ accessToken: mapboxToken });
});

// Explicitly handle requests for specific static files
app.get('/js/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'js', 'bundle.js'));
});

// Catch-all route to serve the frontend's index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'map.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
