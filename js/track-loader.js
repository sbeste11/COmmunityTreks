// Function to load and parse the GPX file
function loadGPXTracksWithPOIs(tracks, index) {
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
                            "description": poi.description,
                            "image": poi.image
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
                            'icon-size': 0.15,
                            'icon-allow-overlap': true,
                            'text-field': ['get', 'name'],
                            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                            'text-offset': [0, 1],
                            'text-anchor': 'top'
                        }
                    });
                }


                // Add POI interactions
                addPOIPopupInteraction(poiLayerId);

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


// Load multiple GPX files
map.on('load', function () {
    const tracks = [
        {
            url: 'Tracks/High_Lonesome_Loop/High_Lonesome_Loop.gpx',
            type: 'loop',
            defaultDirection: 'counterclockwise',
            selectedDirection: 'counterclockwise'
        },
        {
            url: 'Tracks/Mount_Audubon_Ascent/Mount_Audubon_Ascent.gpx',
            type: 'direct'
        }
    ];

    // Use map and Promise.all to correctly preserve the index
    Promise.all(
        tracks.map((track, index) => {
            return loadPOIs(track.url).then(pois => {
                track.pois = pois; // Assign loaded POIs to the track
                return { track, index }; // Return the track along with its index
            });
        })
    ).then(tracksWithIndices => {
        // Now load each track with the preserved index
        tracksWithIndices.forEach(({ track, index }) => {
            loadGPXTracksWithPOIs([track], index);
        });
    });
});