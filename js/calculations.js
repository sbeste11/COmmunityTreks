
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



