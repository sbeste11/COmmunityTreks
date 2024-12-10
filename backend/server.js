const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Backend endpoint (e.g., Mapbox token)
app.get('/mapbox-token', (req, res) => {
    res.json({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
});

// Serve the frontend's `index.html` file for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'map.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
