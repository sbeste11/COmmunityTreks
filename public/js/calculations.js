
// Function to convert distance and elevation based on the unit preference
function convertDistance(distance) {
    return isKilometers ? distance.toFixed(2) + ' km' : (distance * 0.621371).toFixed(2) + ' miles';
}

function convertElevation(elevation) {
    return isKilometers ? elevation.toFixed(2) + ' m' : (elevation * 3.28084).toFixed(2) + ' ft';
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

                const elevationDiff = coordinates[i - 1][2] - coordinates[i][2];
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

















// Unit Toggle and user preferences Logic
document.addEventListener('DOMContentLoaded', function () {
    const unitSwitch = document.getElementById('unitSwitch');
    const unitLabel = document.getElementById('unitLabel'); // Get the label element
    const mapStyleSelect = document.getElementById('mapStyleSelect');

    // Set expiration time (30 minutes)
    const expirationTime = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Wait for the map to be initialized
    const waitForMap = setInterval(() => {
        if (window.map) {
            clearInterval(waitForMap); // Stop checking once the map is initialized
            console.log('Map is initialized. Loading preferences...');
            loadPreferences(); // Safely load preferences after map is ready
        }
    }, 100); // Check every 100ms

    // Event listener for the unit switch
    unitSwitch.addEventListener('change', function () {
        // Update the global variable based on the switch state
        isKilometers = !unitSwitch.checked; // If the switch is checked, it's miles; otherwise, it's kilometers
        
        const unit = unitSwitch.checked ? 'miles' : 'km';
        setPreference('unit', unit);

        // Update the unit label based on the switch state
        unitLabel.textContent = unitSwitch.checked ? 'Miles' : 'Km';

        // Update all active popups
        updateAllPopups();
    });

    // Event listener for the map style dropdown
    mapStyleSelect.addEventListener('change', function () {
        const selectedStyle = mapStyleSelect.value;
        setPreference('mapStyle', selectedStyle);
        applyMapStyle(selectedStyle);
    });

    // Function to set and save preferences
    function setPreference(key, value) {
        const currentTime = new Date().getTime();
        const preference = {
            value: value,
            timestamp: currentTime
        };
        localStorage.setItem(key, JSON.stringify(preference));
    }

    // Function to load preferences and apply them if valid
    function loadPreferences() {
        // Load and validate unit preference
        const unitPreference = JSON.parse(localStorage.getItem('unit'));
        if (unitPreference && isValid(unitPreference.timestamp)) {
            unitSwitch.checked = unitPreference.value === 'miles';
            isKilometers = unitPreference.value !== 'miles';
            unitLabel.textContent = unitSwitch.checked ? 'Miles' : 'Km';
        }

        // Load and validate map style preference
        const mapStylePreference = JSON.parse(localStorage.getItem('mapStyle'));
        if (mapStylePreference && isValid(mapStylePreference.timestamp)) {
            mapStyleSelect.value = mapStylePreference.value;
            applyMapStyle(mapStylePreference.value);
        } else {
            // Apply the default map style if none is set
            applyMapStyle('default');
        }
    }

    // Function to check if a stored preference is still valid
    function isValid(timestamp) {
        const currentTime = new Date().getTime();
        return currentTime - timestamp < expirationTime;
    }

    // Function to update all active popups
    function updateAllPopups() {
        // Iterate through the popupdata array and update each popup
        popupdata.forEach((popupEntry) => {
            if (popupEntry && popupEntry.track && popupEntry.geojson) {
                const { popup, geojson, track, nearestPoint } = popupEntry;
    
                // Use a default direction if none is set
                const direction = track.selectedDirection || 'clockwise';
    
                // Ensure the popup exists before attempting to update
                if (popup) {
                    updatePopupContent(popup, geojson, nearestPoint, direction, track);
                }
            } else {
                console.error("Invalid popupEntry found in popupdata:", popupEntry);
            }
        });
    }
    
    
});


// Function to update the style of the toggle bar and POI text
function updateToggleBarStyle(backgroundColor, textColor) {
    const toggleBar = document.getElementById('toggles-bar');
    toggleBar.style.backgroundColor = backgroundColor === 'black' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    toggleBar.style.color = textColor;

    // Update the color of labels and other text elements inside the toggle bar
    const labels = toggleBar.querySelectorAll('label, span, select');
    labels.forEach(label => {
        label.style.color = textColor;
    });
}


function applyMapStyle(style) {
    if (!map) {
        console.error('Map is not initialized');
        return;
    }

    switch (style) {
        case 'light':
            map.setStyle('mapbox://styles/mapbox/light-v10');
            updateToggleBarStyle('black', 'white');
            break;
        case 'dark':
            map.setStyle('mapbox://styles/mapbox/dark-v10');
            updateToggleBarStyle('white', 'black');
            break;
        case 'satellite':
            map.setStyle('mapbox://styles/mapbox/satellite-v9');
            updateToggleBarStyle('white', 'black');
            break;
        default:
            map.setStyle('mapbox://styles/mapbox/outdoors-v12');
            updateToggleBarStyle('black', 'white');
    }

    // After setting the style, wait for it to load before re-adding icons and layers
    map.once('style.load', function () {
        // Reload POIs and Tracks
        reloadRoutesAndPOIs();
    });
}

// Function to reload routes and POIs after style change
function reloadRoutesAndPOIs() {
    // Reload POI icons
    loadPOIIcons(); 

    // Fetch the tracks from the JSON file
    fetch('Tracks/tracks.json')
        .then(response => response.json())
        .then(tracks => {
            return Promise.all(
                tracks.map((track, index) => {
                    // Load POIs for each track
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