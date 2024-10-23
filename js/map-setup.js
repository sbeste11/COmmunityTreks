// mapbox accessToken 
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Jlc3RlIiwiYSI6ImNtMXRrMXJkZDAzNHIybG9odnR4aGg5YnUifQ.lbICz6C0vlvvIMNMEV8frw';

// creation of map
const map = new mapboxgl.Map({
    container: 'map', // name of div id
    center: [-105.6129, 39.95366], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10, // starting zoom
    style: 'mapbox://styles/mapbox/outdoors-v12'
});

// Global variable to track unit preference (kilometers by default)
let isKilometers = true; // This will store the user's unit preference

// Array to store popup information for routes and POIs
const popupdata = [];

//----------------ICONS -------------------------

map.loadImage('./Images/tree.png', function (error, image) {
    if (error) throw error;
    map.addImage('boundary', image);
});

map.loadImage('./Images/tree.png', function (error, image) {
    if (error) throw error;
    map.addImage('pass', image);
});

map.loadImage('./Images/tree.png', function (error, image) {
    if (error) throw error;
    map.addImage('summit', image);
});