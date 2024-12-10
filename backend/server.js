const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API route to provide the Mapbox token
app.get('/mapbox-token', (req, res) => {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN; // Fetch token from Config Vars
    if (!mapboxToken) {
        return res.status(500).json({ error: 'Mapbox token is not configured' });
    }
    res.json({ accessToken: mapboxToken });
});

// Catch-all route to serve the frontend's index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'map.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
