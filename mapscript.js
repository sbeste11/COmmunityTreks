// mapbox accessToken here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Jlc3RlIiwiYSI6ImNtMXRrMXJkZDAzNHIybG9odnR4aGg5YnUifQ.lbICz6C0vlvvIMNMEV8frw';

// Global variable to track unit preference (kilometers by default)
let isKilometers = true; // This will store the user's unit preference

// creation of map
const map = new mapboxgl.Map({
    container: 'map', // name of div id
    center: [-105.6129, 39.95366], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10, // starting zoom
    style: 'mapbox://styles/mapbox/outdoors-v12'
});

// Array to store popup information for routes and POIs
const popupdata = [];
//let openPopups = [];

// Function to load and parse the GPX file
// Function to load and parse the GPX file
function loadGPXTracksWithPOIs(tracks) {
    tracks.forEach((track, index) => {
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
                const poiSourceId = `gpxTrackPOIsSource${index}`;
                const poiLayerId = `gpxTrackPOIs${index}`;
                const nameLayerId = `gpxTrackName${index}`;

                // Add the GPX track as a GeoJSON source
                map.addSource(sourceId, {
                    'type': 'geojson',
                    'data': {
                        "type": "FeatureCollection",
                        "features": trackFeatures
                    }
                });

                // Add a line layer to display the GPX track
                map.addLayer({
                    'id': layerId,
                    'type': 'line',
                    'source': sourceId,
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#c3002f', // Red color for the track
                        'line-width': 3
                    }
                });

                // Calculate total distance and elevation gain
                let distance = turf.length(geojson, { units: 'kilometers' });
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
                            "description": poi.description
                        }
                    }));

                    // Add a source for the POIs
                    map.addSource(poiSourceId, {
                        'type': 'geojson',
                        'data': {
                            "type": "FeatureCollection",
                            "features": poiFeatures
                        }
                    });

                    // Add a symbol layer for the POIs
                    map.addLayer({
                        'id': poiLayerId,
                        'type': 'symbol',
                        'source': poiSourceId,
                        'layout': {
                            'icon-image': ['get', 'icon'],
                            'icon-size': 0.1,
                            'icon-allow-overlap': true,
                            'text-field': ['get', 'name'],
                            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                            'text-offset': [0, 1],
                            'text-anchor': 'top'
                        }
                    });
                }

                // Create a GeoJSON feature for the route name at the start point
                const startPoint = coordinates[0];
                const routeNameFeature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": startPoint
                    },
                    "properties": {
                        "name": track.name,
                        "routeInfo": {
                            "distance": distance,
                            "elevationGain": totalElevationGain
                        }
                    }
                };

                // Add a new source for the route name
                map.addSource(`${sourceId}-routeName`, {
                    'type': 'geojson',
                    'data': {
                        "type": "FeatureCollection",
                        "features": [routeNameFeature]
                    }
                });

                // Add a symbol layer for the route name
                map.addLayer({
                    'id': nameLayerId,
                    'type': 'symbol',
                    'source': `${sourceId}-routeName`,
                    'layout': {
                        'text-field': ['get', 'name'],
                        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                        'text-offset': [0, 1.5],
                        'text-anchor': 'top',
                        'text-allow-overlap': true
                    },
                    'paint': {
                        'text-color': '#000000' // Set a color for the route name text
                    }
                });

                // Add POI interactions
                addPOIPopupInteraction(poiLayerId);

                // Add route name popup interaction
                addRouteNamePopupInteraction(nameLayerId, track.name, distance, totalElevationGain);

                // Add interactions based on route type
                if (track.type === 'loop') {
                    addLoopRouteInteraction(layerId, geojson, track, distance, totalElevationGain);
                } else {
                    addNonLoopRouteInteraction(layerId, geojson, track, distance, totalElevationGain);
                }

                // Store the popup instance and its update function for future updates
                const popupEntry = {
                    layerId,
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
                map.on('mouseenter', layerId, function () {
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseenter', poiLayerId, function () {
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseenter', nameLayerId, function () {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to the default when it leaves
                map.on('mouseleave', layerId, function () {
                    map.getCanvas().style.cursor = '';
                });
                map.on('mouseleave', poiLayerId, function () {
                    map.getCanvas().style.cursor = '';
                });
                map.on('mouseleave', nameLayerId, function () {
                    map.getCanvas().style.cursor = '';
                });
            })
            .catch(error => console.log('Error loading GPX track: ', error));
    });
}



// Function to convert distance and elevation based on the unit preference
function convertDistance(distance) {
    return isKilometers ? distance.toFixed(2) + ' km' : (distance * 0.621371).toFixed(2) + ' miles';
}

function convertElevation(elevation) {
    return isKilometers ? elevation.toFixed(2) + ' m' : (elevation * 3.28084).toFixed(2) + ' ft';
}

// Function to handle loop routes with distance and elevation calculation
function addLoopRouteInteraction(layerId, geojson, track, totalDistance, totalElevationGain) {
    map.off('click', layerId);
    map.on('click', layerId, function (e) {
        // Prevent interference with POI clicks
        const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
        if (features.length === 0) return;

        const clickedPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
        const nearestPoint = turf.nearestPointOnLine(geojson.features[0], clickedPoint, { units: 'kilometers' });
        const nearestIndex = nearestPoint.properties.index;

        const elevationAtNearestPoint = geojson.features[0].geometry.coordinates[nearestIndex][2];

        const popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('') // Initialize with empty content
            .addTo(map);

        updatePopupContent(popup, geojson, nearestPoint, track.selectedDirection, track);

        const popupEntry = {
            layerId,
            popup,
            geojson,
            nearestPoint,
            updateContent: function () {
                updatePopupContent(popup, geojson, nearestPoint, track.selectedDirection, track);
            }
        };
        popupdata.push(popupEntry);

        popup.on('close', function () {
            const index = popupdata.findIndex(p => p.popup === popup);
            if (index !== -1) {
                popupdata.splice(index, 1);
            }
        });
    });
}



// Function to calculate distance and elevation gain based on the direction and nearest point
function calculateDistanceAndElevation(geojson, nearestPoint, direction) {
    const coordinates = geojson.features[0].geometry.coordinates;

    // Check if nearestPoint and its properties exist
    if (!nearestPoint || !nearestPoint.properties || typeof nearestPoint.properties.index === 'undefined') {
        console.error('Invalid nearestPoint data:', nearestPoint);
        return { distanceToPoint: 0, elevationToPoint: 0 };
    }

    const nearestIndex = nearestPoint.properties.index;
    let distance = 0;
    let elevationGain = 0;

    if (direction === 'counterclockwise') {
        for (let i = 0; i <= nearestIndex; i++) {
            if (i > 0) {
                const segmentDistance = turf.distance(turf.point(coordinates[i - 1]), turf.point(coordinates[i]), { units: 'kilometers' });
                distance += segmentDistance;

                const elevationDiff = coordinates[i][2] - coordinates[i - 1][2];
                if (elevationDiff > 0) {
                    elevationGain += elevationDiff;
                }
            }
        }
    } else {
        for (let i = coordinates.length - 1; i >= nearestIndex; i--) {
            if (i < coordinates.length - 1) {
                const segmentDistance = turf.distance(turf.point(coordinates[i]), turf.point(coordinates[i + 1]), { units: 'kilometers' });
                distance += segmentDistance;

                const elevationDiff = coordinates[i + 1][2] - coordinates[i][2];
                if (elevationDiff > 0) {
                    elevationGain += elevationDiff;
                }
            }
        }
    }

    return {
        distanceToPoint: distance,
        elevationToPoint: elevationGain
    };
}




// Function to handle direct or out-and-back routes
function addNonLoopRouteInteraction(layerId, geojson, track, distance, totalElevationGain) {
    map.off('click', layerId);

    map.on('click', layerId, function (e) {
        const popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${track.url}</strong><br>Distance: ${convertDistance(distance)}<br>Elevation Gain: ${convertElevation(totalElevationGain)}`)
            .addTo(map);

        popupdata.push({ popup, geojson, distance, totalElevationGain });
    });
}

// Function to update popups when the unit toggle is switched
function updatePopupContent(popup, geojson, nearestPoint, direction, track) {
    // Calculate the distance and elevation based on the direction and the current unit preference
    const { distanceToPoint, elevationToPoint } = calculateDistanceAndElevation(geojson, nearestPoint, track.selectedDirection);

    // Convert the distance and elevation to the appropriate unit
    const convertedDistance = convertDistance(distanceToPoint);
    const convertedElevation = convertElevation(elevationToPoint);

    // Generate the popup content
    const popupContent = `
        <strong>Route Information</strong><br>
        Distance to Point: ${convertedDistance}<br>
        Elevation Gain to Point: ${convertedElevation}<br>
        <label>Direction: 
            <select id="directionToggle">
                <option value="clockwise" ${track.selectedDirection === 'clockwise' ? 'selected' : ''}>Clockwise</option>
                <option value="counterclockwise" ${track.selectedDirection === 'counterclockwise' ? 'selected' : ''}>Counterclockwise</option>
            </select>
        </label>
    `;

    // Set the popup HTML content
    popup.setHTML(popupContent);

    // Attach an event listener to the direction toggle within the popup
    const directionToggle = document.getElementById('directionToggle');
    if (directionToggle) {
        // Define the update function for direction changes
        function updateDirection() {
            track.selectedDirection = this.value; // Update the track's selected direction
            // Update the popup content again when the direction changes
            updatePopupContent(popup, geojson, nearestPoint, track.selectedDirection, track);
        }

        // Remove any existing event listener before adding a new one
        directionToggle.removeEventListener('change', updateDirection);

        // Attach the event listener
        directionToggle.addEventListener('change', updateDirection);
    }
}






// Load multiple GPX files
map.on('load', function () {
    loadGPXTracksWithPOIs([
        {
            url: 'Tracks/High_Lonesome_Loop.gpx',
            type: 'loop',
            defaultDirection: 'counterclockwise',
            selectedDirection: 'counterclockwise',
            pois: [ 
                { 
                    name: 'Indian Peaks Wilderness', 
                    lat: 39.956787, 
                    lng: -105.621758, 
                    icon: 'boundary',
                    description: 'This is a POI!'
                 }, 
                { 
                    name: 'Pass', 
                    lat: 39.966572, 
                    lng: -105.688418, 
                    icon: 'pass',
                    description: 'This is a POI!'
                }
            ]
        },
        {
            url: 'Tracks/Mount_Audubon_Ascent.gpx',
            type: 'direct',
            pois: [
                { 
                    name: 'Summit', 
                    lat: 40.09892, 
                    lng: -105.61641, 
                    icon: 'summit',
                    description: 'This is a POI!'
                }
            ]
        }
    ]);
});

// Unit Toggle Logic
document.addEventListener('DOMContentLoaded', function () {
    const unitSwitch = document.getElementById('unitSwitch');
    const unitLabel = document.getElementById('unitLabel');

    // Add event listener to toggle switch
    unitSwitch.addEventListener('change', function () {
        isKilometers = unitSwitch.checked ? false : true;
        unitLabel.textContent = isKilometers ? 'Kilometers' : 'Miles';

        // Update all open popups with the new unit
        popupdata.forEach(popupEntry => {
            if (popupEntry.popup != null) {
                popupEntry.updateContent(); // Call the stored update function for each open popup
            }
        });
    });
});

//-------------------POI Popups------------
function addPOIPopupInteraction(poiLayerId) {
    map.on('click', poiLayerId, function (e) {
        const features = e.features[0];
        const coordinates = features.geometry.coordinates.slice();
        const name = features.properties.name;
        const description = features.properties.description || 'No description available';

        // Create the popup
        const popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
                <strong>${name}</strong><br>
                ${description}
            `)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the POI layer
    map.on('mouseenter', poiLayerId, function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to default when leaving the POI layer
    map.on('mouseleave', poiLayerId, function () {
        map.getCanvas().style.cursor = '';
    });
}

//-------------------Route name Popup------------
function addRouteNamePopupInteraction(layerId, trackName, distance, totalElevationGain) {
    map.on('click', function (e) {
        // Only proceed if the clicked feature is the track name, not the line itself or a POI
        const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
        if (features.length === 0) return;

        const coordinates = e.lngLat;

        const popupContent = `
            <strong>${trackName}</strong><br>
            Total Distance: ${convertDistance(distance)}<br>
            Total Elevation Gain: ${convertElevation(totalElevationGain)}
        `;

        const popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });
}

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
