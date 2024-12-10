// mapbox accessToken 
fetch('https://your-app-name.herokuapp.com/mapbox-token')
    .then(response => response.json())
    .then(data => {
        mapboxgl.accessToken = data.accessToken;
        const map = new mapboxgl.Map({
            container: 'map',
            center: [-105.6129, 39.99366],
            zoom: 10,
            style: 'mapbox://styles/mapbox/outdoors-v12'
        });
    })
    .catch(error => console.error('Error fetching Mapbox access token:', error));


// creation of map
const map = new mapboxgl.Map({
    container: 'map', // name of div id
    center: [-105.6129, 39.99366], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10, // starting zoom
    style: 'mapbox://styles/mapbox/outdoors-v12'
});

// Global variable to track unit preference (kilometers by default)
let isKilometers = true; // This will store the user's unit preference
let isLight = true; // This will store the user's color preference

// Array to store popup information for routes and POIs
const popupdata = [];

//----------------ICONS -------------------------

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