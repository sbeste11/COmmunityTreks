import length from '@turf/length';
import { point } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import distance from '@turf/distance';
import { calculateDistanceAndElevation } from './calculations.js'
import { convertDistance } from './calculations.js'
import { convertElevation } from './calculations.js'
import { popupdata } from './map-setup.js'


// Function to handle direct or out-and-back routes
function addOutAndBackRouteInteraction(mainMap, layerId, interactionLayerId, geojson, track, totalDistance, totalElevationGain) {
    mainMap.off('click', interactionLayerId);
    mainMap.off('touchstart', interactionLayerId);

    function handleInteraction (e) {
        // Find the nearest point on the route to the clicked location
        const clickedPoint = point([e.lngLat.lng, e.lngLat.lat]);
        const nearestPoint = nearestPointOnLine(geojson.features[0], clickedPoint, { units: 'kilometers' });
        const nearestIndex = nearestPoint.properties.index;

        const coordinates = geojson.features[0].geometry.coordinates;

        let forwardDistance = 0;
        let forwardElevationGain = 0;

        // Calculate forward distance and elevation gain
        for (let i = 0; i <= nearestIndex; i++) {
            if (i > 0) {
                const segmentDistance = distance(point(coordinates[i - 1]), point(coordinates[i]), { units: 'kilometers' });
                forwardDistance += segmentDistance;

                const elevationDiff = coordinates[i][2] - coordinates[i - 1][2];
                if (elevationDiff > 0) {
                    forwardElevationGain += elevationDiff;
                }
            }
        }

        // Total distance and elevation gain for out-and-back
        const outAndBackDistance = forwardDistance;
        const outAndBackElevationGain = forwardElevationGain;

        const popupContent = `
            <strong>${track.name}</strong><br>
            Distance to Point: ${convertDistance(outAndBackDistance)}<br>
            Elevation Gain: ${convertElevation(outAndBackElevationGain)}
        `;

        const popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(mainMap);

        popupdata.push({ popup, geojson, track, outAndBackDistance, outAndBackElevationGain });

        popup.on('close', function () {
            const index = popupdata.findIndex(p => p.popup === popup);
            if (index !== -1) {
                popupdata.splice(index, 1);
            }
        });
    }

    mainMap.on('click', interactionLayerId, handleInteraction);
    mainMap.on('touchstart', interactionLayerId, handleInteraction);
}


// Function to update popups when the unit toggle is switched
export function updatePopupContent(popup, geojson, nearestPoint, direction, track) {
    // Check if this is a loop or direct (out-and-back) route
    if (track.type === 'loop') {
        // For loop routes, calculate distance and elevation gain to the nearest point
        const { distanceToPoint, elevationToPoint } = calculateDistanceAndElevation(
            geojson,
            nearestPoint,
            direction
        );

        // Convert the values to the currently selected unit
        const convertedDistance = convertDistance(distanceToPoint);
        const convertedElevation = convertElevation(elevationToPoint);

        // Update popup content for loop routes
        const popupContent = `
            <strong>${track.name}</strong><br>
            Distance to Point: ${convertedDistance}<br>
            Elevation Gain to Point: ${convertedElevation}<br>
            <label>Direction: 
                <select id="directionToggle">
                    <option value="clockwise" ${direction === 'clockwise' ? 'selected' : ''}>Clockwise</option>
                    <option value="counterclockwise" ${direction === 'counterclockwise' ? 'selected' : ''}>Counterclockwise</option>
                </select>
            </label>
        `;

        popup.setHTML(popupContent);

        // Add the event listener for direction toggle
        const directionToggle = document.getElementById('directionToggle');
        if (directionToggle) {
            directionToggle.addEventListener('change', function () {
                track.selectedDirection = this.value; // Update the track's direction
                updatePopupContent(popup, geojson, nearestPoint, track.selectedDirection, track); // Refresh popup
            });
        }

    } else if (track.type === 'direct') {
        // For direct (out-and-back) routes, calculate the total out-and-back distance and elevation gain
        const coordinates = geojson.features[0].geometry.coordinates;

        let forwardDistance = 0;
        let forwardElevationGain = 0;

        for (let i = 1; i < coordinates.length; i++) {
            const segmentDistance = distance(
                point(coordinates[i - 1]),
                point(coordinates[i]),
                { units: 'kilometers' }
            );
            forwardDistance += segmentDistance;

            const elevationDiff = coordinates[i][2] - coordinates[i - 1][2];
            if (elevationDiff > 0) {
                forwardElevationGain += elevationDiff;
            }
        }

        const outAndBackDistance = forwardDistance;
        const outAndBackElevationGain = forwardElevationGain;

        const convertedDistance = convertDistance(outAndBackDistance);
        const convertedElevation = convertElevation(outAndBackElevationGain);

        // Update popup content for direct routes
        const popupContent = `
            <strong>${track.name}</strong><br>
            Distance to point: ${convertedDistance}<br>
            Elevation Gain to point: ${convertedElevation}
        `;

        popup.setHTML(popupContent);
    }
}



// Function to handle loop routes with distance and elevation calculation
function addLoopRouteInteraction(mainMap, layerId, interactionLayerId, geojson, track, totalDistance, totalElevationGain) {
    mainMap.off('click', interactionLayerId);
    mainMap.off('touchstart', interactionLayerId);

    function handleInteraction (e) {
        // Prevent interference with POI clicks
        const features = mainMap.queryRenderedFeatures(e.point, { layers: [interactionLayerId] });
        if (features.length === 0) return;

        const clickedPoint = point([e.lngLat.lng, e.lngLat.lat]);
        const nearestPoint = nearestPointOnLine(geojson.features[0], clickedPoint, { units: 'kilometers' });
        const nearestIndex = nearestPoint.properties.index;

        const elevationAtNearestPoint = geojson.features[0].geometry.coordinates[nearestIndex][2];

        const popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('') // Initialize with empty content
            .addTo(mainMap);
        
        updatePopupContent(popup, geojson, nearestPoint, track.selectedDirection, track);

        const popupEntry = {
            layerId,
            interactionLayerId,
            track,
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
    }
    mainMap.on('click', interactionLayerId, handleInteraction);
    mainMap.on('touchstart', interactionLayerId, handleInteraction);
}

//-------------------POI Popups------------
function addPOIPopupInteraction(mainMap, poiLayerId) {
    mainMap.on('click', poiLayerId, function (e) {
        const features = e.features[0];
        const coordinates = features.geometry.coordinates.slice();
        const name = features.properties.name;
        const description = features.properties.description || 'No description available';
        const imageUrl = features.properties.image || '';

        // Create the popup content with an image if available
        let popupContent = `
            <strong>${name}</strong><br>
            ${description}
        `;

        if (imageUrl) {
            popupContent += `<br><img src="${imageUrl}" alt="${name}" id="poi-img">`;
        }

        // Create and add the popup to the map
        const popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(mainMap);
    });

    // Change the cursor to a pointer when the mouse is over the POI layer
    mainMap.on('mouseenter', poiLayerId, function () {
        mainMap.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to default when leaving the POI layer
    mainMap.on('mouseleave', poiLayerId, function () {
        mainMap.getCanvas().style.cursor = '';
    });
}

export { addPOIPopupInteraction };
export { addLoopRouteInteraction };
export { addOutAndBackRouteInteraction };