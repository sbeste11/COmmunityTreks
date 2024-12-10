function loadPOIIcons() {
    // Load each icon image you want to use for your POIs
    mainMap.loadImage('./Images/wilderness.png', function (error, image) {
        if (error) throw error;
        if (!mainMap.hasImage('boundary')) {
            mainMap.addImage('boundary', image);
        }
    });

    mainMap.loadImage('./Images/pass.png', function (error, image) {
        if (error) throw error;
        if (!mainMap.hasImage('pass')) {
            mainMap.addImage('pass', image);
        }
    });

    mainMap.loadImage('./Images/pass.png', function (error, image) {
        if (error) throw error;
        if (!mainMap.hasImage('summit')) {
            mainMap.addImage('summit', image);
        }
    });

    mainMap.loadImage('./Images/flag.png', function (error, image) {
        if (error) throw error;
        if (!mainMap.hasImage('flag')) {
            mainMap.addImage('flag', image);
        }
    });

    mainMap.loadImage('./Images/junction.png', function (error, image) {
        if (error) throw error;
        if (!mainMap.hasImage('junction')) {
            mainMap.addImage('junction', image);
        }
    });
}