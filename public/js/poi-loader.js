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

function loadPOIIcons() {
    // Load each icon image you want to use for your POIs
    map.loadImage('./Images/wilderness.png', function (error, image) {
        if (error) throw error;
        if (!map.hasImage('boundary')) {
            map.addImage('boundary', image);
        }
    });

    map.loadImage('./Images/pass.png', function (error, image) {
        if (error) throw error;
        if (!map.hasImage('pass')) {
            map.addImage('pass', image);
        }
    });

    map.loadImage('./Images/pass.png', function (error, image) {
        if (error) throw error;
        if (!map.hasImage('summit')) {
            map.addImage('summit', image);
        }
    });

    map.loadImage('./Images/flag.png', function (error, image) {
        if (error) throw error;
        if (!map.hasImage('flag')) {
            map.addImage('flag', image);
        }
    });

    map.loadImage('./Images/junction.png', function (error, image) {
        if (error) throw error;
        if (!map.hasImage('junction')) {
            map.addImage('junction', image);
        }
    });
}