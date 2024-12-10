const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route to serve the Mapbox token
app.get('/mapbox-token', (req, res) => {
    res.json({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
