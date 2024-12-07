// Function to handle direct or out-and-back routes
function addOutAndBackRouteInteraction(layerId, geojson, track, totalDistance, totalElevationGain) {
    map.off('click', layerId);

    map.on('click', layerId, function (e) {
        // Find the nearest point on the route to the clicked location
        const clickedPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
        const nearestPoint = turf.nearestPointOnLine(geojson.features[0], clickedPoint, { units: 'kilometers' });
        const nearestIndex = nearestPoint.properties.index;

        const coordinates = geojson.features[0].geometry.coordinates;

        let forwardDistance = 0;
        let forwardElevationGain = 0;

        // Calculate forward distance and elevation gain
        for (let i = 0; i <= nearestIndex; i++) {
            if (i > 0) {
                const segmentDistance = turf.distance(turf.point(coordinates[i - 1]), turf.point(coordinates[i]), { units: 'kilometers' });
                forwardDistance += segmentDistance;

                const elevationDiff = coordinates[i][2] - coordinates[i - 1][2];
                if (elevationDiff > 0) {
                    forwardElevationGain += elevationDiff;
                }
            }
        }

        // Total distance and elevation gain for out-and-back
        const outAndBackDistance = forwardDistance * 2;
        const outAndBackElevationGain = forwardElevationGain * 2;

        const popupContent = `
            <strong>${track.name}</strong><br>
            Distance to Point: ${convertDistance(outAndBackDistance)}<br>
            Elevation Gain: ${convertElevation(outAndBackElevationGain)}
        `;

        const popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(map);

        popupdata.push({ popup, geojson, track, outAndBackDistance, outAndBackElevationGain });

        popup.on('close', function () {
            const index = popupdata.findIndex(p => p.popup === popup);
            if (index !== -1) {
                popupdata.splice(index, 1);
            }
        });
    });
}


// Function to update popups when the unit toggle is switched
function updatePopupContent(popup, geojson, nearestPoint, direction, track) {
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
            const segmentDistance = turf.distance(
                turf.point(coordinates[i - 1]),
                turf.point(coordinates[i]),
                { units: 'kilometers' }
            );
            forwardDistance += segmentDistance;

            const elevationDiff = coordinates[i][2] - coordinates[i - 1][2];
            if (elevationDiff > 0) {
                forwardElevationGain += elevationDiff;
            }
        }

        const outAndBackDistance = forwardDistance * 2;
        const outAndBackElevationGain = forwardElevationGain * 2;

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

//-------------------POI Popups------------
function addPOIPopupInteraction(poiLayerId) {
    map.on('click', poiLayerId, function (e) {
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
            popupContent += `<br><img src="${imageUrl}" alt="${name}" style="width: 100%; max-width: 200px; margin-top: 10px;">`;
        }

        // Create and add the popup to the map
        const popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
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
// function addRouteNamePopupInteraction(layerId, trackName, distance, totalElevationGain) {
//     map.on('click', function (e) {
//         // Only proceed if the clicked feature is the track name, not the line itself or a POI
//         const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
//         if (features.length === 0) return;

//         const coordinates = e.lngLat;

//         const popupContent = `
//             <strong>${trackName}</strong><br>
//             Total Distance: ${convertDistance(distance)}<br>
//             Total Elevation Gain: ${convertElevation(totalElevationGain)}
//         `;

//         const popup = new mapboxgl.Popup()
//             .setLngLat(coordinates)
//             .setHTML(popupContent)
//             .addTo(map);
//     });
// }
