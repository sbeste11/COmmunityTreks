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
            console.log('v: ', this.value);
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
