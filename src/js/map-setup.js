import length from '@turf/length';
import { addPOIPopupInteraction } from './interactions.js';
import { addLoopRouteInteraction } from './interactions.js';
import { addOutAndBackRouteInteraction } from './interactions.js';

// Global variable to track unit preference (kilometers by default)
export let isKilometers = true; // This will store the user's unit preference

// Array to store popup information for routes and POIs
export let popupdata = [];
export let mainMap = null;

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

// Fetch Mapbox token and initialize map
fetch('/mapbox-token')
    .then(response => response.json())
    .then(data => {
        mapboxgl.accessToken = data.accessToken;

        // Initialize the Mapbox map
        mainMap = new mapboxgl.Map({
            container: 'map',
            center: [-105.6129, 39.99366],
            zoom: 10,
            style: 'mapbox://styles/mapbox/outdoors-v12',
        });
        //console.log('Initializing mainMap...');
        

        // Add images after the map is loaded
        mainMap.on('load', async () => {
            //console.log('Map load event triggered');
            try {
                // Add images to the map
                await addMapImages();

                // call loadGPXTracks
                loadGPXTracks();
                window.mainMap = mainMap;
            } catch (error) {
                console.error('Error during map initialization:', error);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching Mapbox access token:', error);
    });

// Function to load images
async function addMapImages() {
    const images = [
        { url: './Images/wilderness.png', name: 'boundary' },
        { url: './Images/pass.png', name: 'pass' },
        { url: './Images/pass.png', name: 'summit' },
        { url: './Images/flag.png', name: 'flag' },
        { url: './Images/junction.png', name: 'junction' },
    ];

    for (const image of images) {
        await new Promise((resolve, reject) => {
            mainMap.loadImage(image.url, (error, loadedImage) => {
                if (error) {
                    console.error(`Error loading image: ${image.url}`, error);
                    reject(error);
                } else {
                    mainMap.addImage(image.name, loadedImage);
                    resolve();
                }
            });
        });
    }
}

// Function to load and parse the GPX file
export function loadGPXTracksWithPOIs(tracks, index) {
    tracks.forEach((track) => {
        fetch(track.url) 
            .then(response => response.text())
            .then(str => {
                const parser = new DOMParser();
                const gpxDoc = parser.parseFromString(str, 'application/xml');
                const geojson = toGeoJSON.gpx(gpxDoc);

                // Try to extract the name from the first feature in GeoJSON
                const trackName = geojson.features[0]?.properties?.name || `Unnamed Track ${index + 1}`;
                
                // Update the track's name based on the GeoJSON data if available
                track.name = trackName;

                // Separate POIs from track features
                const trackFeatures = geojson.features.filter(feature => feature.geometry.type !== 'Point');

                // Unique source and layer IDs for each GPX track
                const sourceId = `gpxTrack${index}`;
                const layerId = `gpxTrackLine${index}`;
                const interactionLayerId = `gpxTrackInteraction${index}`;
                const poiSourceId = `gpxTrackPOIsSource${index}`;
                const poiLayerId = `gpxTrackPOIs${index}`;
                const nameLayerId = `gpxTrackName${index}`;

                // Remove existing sources and layers if they already exist
                if (mainMap.getSource(sourceId)) {
                    mainMap.removeSource(interactionLayerId);
                    mainMap.removeLayer(layerId);
                    mainMap.removeSource(sourceId);
                }
                if (mainMap.getSource(poiSourceId)) {
                    mainMap.removeLayer(poiLayerId);
                    mainMap.removeSource(poiSourceId);
                }

                // Add the GPX track as a GeoJSON source
                mainMap.addSource(sourceId, {
                    'type': 'geojson',
                    'data': {
                        "type": "FeatureCollection",
                        "features": trackFeatures
                    }
                });

                // Add a line layer to display the GPX track
                mainMap.addLayer({
                    'id': layerId,
                    'type': 'line',
                    'source': sourceId,
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': track.color || '#c3002f', // Red color for the track
                        'line-width': 3
                    }
                });

                // Add an invisible, wider line layer for interactions
                mainMap.addLayer({
                    'id': interactionLayerId,
                    'type': 'line',
                    'source': sourceId,
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round',
                        'visibility': 'visible' // Ensure the layer is visible
                    },
                    'paint': {
                        'line-color': '#000000', // Color doesn't matter since it's transparent
                        'line-width': 20, // Increase this value to make the touch area larger
                        'line-opacity': 0 // Make the line invisible
                    }
                });

                // Calculate total distance and elevation gain
                let distance = length(geojson, { units: 'kilometers' });
                let totalElevationGain = 0;
                const coordinates = trackFeatures[0].geometry.coordinates;
                for (let i = 1; i < coordinates.length; i++) {
                    const prevElevation = coordinates[i - 1][2];
                    const currElevation = coordinates[i][2];
                    if (currElevation > prevElevation) {
                        totalElevationGain += currElevation - prevElevation;
                    }
                }

                // Add POIs if present
                if (track.pois && track.pois.length > 0) {
                    const poiFeatures = track.pois.map(poi => ({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [poi.lng, poi.lat]
                        },
                        "properties": {
                            "name": poi.name,
                            "icon": poi.icon,
                            "description": poi.description,
                            "image": poi.image,
                            "weight": getPriorityForIcon(poi.icon) // Assign weight based on the icon
                        }
                    }));

                    // Add a source for the POIs
                    mainMap.addSource(poiSourceId, {
                        'type': 'geojson',
                        'data': {
                            "type": "FeatureCollection",
                            "features": poiFeatures
                        }
                    });

                    // Add a symbol layer for the POIs
                    mainMap.addLayer({
                        'id': poiLayerId,
                        'type': 'symbol',
                        'source': poiSourceId,
                        'layout': {
                            'icon-image': ['get', 'icon'],
                            'icon-size': 0.15,
                            'icon-allow-overlap': true,
                            'text-field': ['get', 'name'],
                            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                            'text-offset': [0, 1],
                            'text-anchor': 'top',
                            'symbol-sort-key': ['get', 'weight'] // Use the weight property for sorting
                        },
                        'paint': {
                            'text-color': '#666666', // Set the text color for the POI labels
                            'text-halo-color': 'white', // Optional: Add a halo for better visibility
                            'text-halo-width': 1
                        }
                    });
                }


                // Add POI interactions
                addPOIPopupInteraction(mainMap, poiLayerId);

                // Add interactions based on route type
                if (track.type === 'loop') {
                    addLoopRouteInteraction(mainMap, layerId, interactionLayerId, geojson, track, distance, totalElevationGain);
                } else {

                    addOutAndBackRouteInteraction(mainMap, layerId, interactionLayerId, geojson, track, distance, totalElevationGain);
                }
                

                // Store the popup instance and its update function for future updates
                const popupEntry = {
                    layerId,
                    //interactionLayerId,
                    geojson,
                    track,
                    distance,
                    totalElevationGain,
                    popup: null, // Initially, there is no active popup
                    updateContent: function () {
                        if (this.popup) {
                            updatePopupContent(this.popup, this.geojson, this.track, this.track.selectedDirection);
                        }
                    }
                };
                popupdata.push(popupEntry);

                // Change the cursor to a pointer when the mouse is over the track, route name, or POIs
                mainMap.on('mouseenter', interactionLayerId, function () {
                    mainMap.getCanvas().style.cursor = 'pointer';
                });
                mainMap.on('mouseenter', poiLayerId, function () {
                    mainMap.getCanvas().style.cursor = 'pointer';
                });
                mainMap.on('mouseenter', nameLayerId, function () {
                    mainMap.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to the default when it leaves
                mainMap.on('mouseleave', interactionLayerId, function () {
                    mainMap.getCanvas().style.cursor = '';
                });
                mainMap.on('mouseleave', poiLayerId, function () {
                    mainMap.getCanvas().style.cursor = '';
                });
                mainMap.on('mouseleave', nameLayerId, function () {
                    mainMap.getCanvas().style.cursor = '';
                });
            })
            .catch(error => console.log('Error loading GPX track: ', error));
    });
}


// Function to load all GPX tracks and their POIs
function loadGPXTracks() {
    if (!mainMap) {
        console.error('Map is not initialized');
        return;
    }

    // Fetch the tracks from the JSON file
    fetch('Tracks/tracks.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tracks.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(tracks => {
            // Use Promise.all to load POIs for all tracks before processing them
            return Promise.all(
                tracks.map((track, index) => {
                    return loadPOIs(track.url).then(pois => {
                        track.pois = pois; // Assign loaded POIs to the track
                        return { track, index }; // Return the track along with its index
                    });
                })
            );
        })
        .then(tracksWithIndices => {
            // Now load each track with the preserved index
            tracksWithIndices.forEach(({ track, index }) => {
                loadGPXTracksWithPOIs([track], index);
            });
        })
        .catch(error => console.error('Error loading tracks file:', error));
}

export function loadPOIs(trackUrl) {
    // Derive the POI file path from the track URL
    const trackName = trackUrl.split('/').slice(-1)[0].replace('.gpx', '');
    const poiFilePath = `Tracks/${trackName}/poi.txt`;

    return fetch(poiFilePath)
        .then(response => response.text())
        .then(text => {
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('Error parsing POI data:', error);
                return [];
            }
        })
        .catch(error => {
            console.error('Error loading POI file:', error);
            return [];
        });
}

// Helper function to assign priority based on icon type
function getPriorityForIcon(icon) {
    const priorityMap = {
        flag: 100, 
        summit: 100, 
        boundary: 50,
        pass: 40,
        junction: 10 
    };
    return priorityMap[icon] || 0; // Default to 0 if the icon is not in the map
}

import './interactions.js';
import './calculations.js';
import './poi-loader.js';
