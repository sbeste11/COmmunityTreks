// Global variable to track unit preference (kilometers by default)
let isKilometers = true; // This will store the user's unit preference
let isLight = true; // This will store the user's color preference

// Array to store popup information for routes and POIs
let popupdata = [];
let map;

// Function to fetch and inject the Google Tag snippet
function loadGoogleTag() {
    fetch('/google-tag')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Google Tag snippet');
            }
            return response.text();
        })
        .then(tagSnippet => {
            // Create a container to hold the tag snippet
            const container = document.createElement('div');
            container.innerHTML = tagSnippet;

            // Append the script(s) to the head
            document.head.appendChild(container.querySelector('script'));
        })
        .catch(error => console.error('Error loading Google Tag:', error));
}

// mapbox accessToken 
fetch('/mapbox-token')
    .then(response => response.json())
    .then(data => {
        mapboxgl.accessToken = data.accessToken;

        map = new mapboxgl.Map({
            container: 'map',
            center: [-105.6129, 39.99366],
            zoom: 10,
            style: 'mapbox://styles/mapbox/outdoors-v12'
        });

        map.loadImage('./Images/wilderness.png', function (error, image) {
            if (error) throw error;
            map.addImage('boundary', image);
        });
        
        map.loadImage('./Images/pass.png', function (error, image) {
            if (error) throw error;
            map.addImage('pass', image);
        });
        
        map.loadImage('./Images/pass.png', function (error, image) {
            if (error) throw error;
            map.addImage('summit', image);
        });
        
        map.loadImage('./Images/flag.png', function (error, image) {
            if (error) throw error;
            map.addImage('flag', image);
        });
        
        map.loadImage('./Images/junction.png', function (error, image) {
            if (error) throw error;
            map.addImage('junction', image);
        });

        map.on('load', () => {
            loadGPXTracks(); // Ensure GPX tracks are loaded only after the map is initialized
            loadGoogleTag();
        });
    })
    .catch(error => {
        console.error('Error fetching Mapbox access token:', error);
    });
