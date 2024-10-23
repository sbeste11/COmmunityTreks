function loadPOIs(trackUrl) {
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
