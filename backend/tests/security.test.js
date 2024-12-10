const fs = require('fs');

test('rel="noopener noreferrer" in links', () => {
    const html = fs.readFileSync('public/index.html', 'utf8');
    expect(html).toMatch(/rel="noopener noreferrer"/g);
});

test('API keys and secrets are not exposed', () => {
    const publicFiles = fs.readFileSync('public/js/bundle.js', 'utf8');
    expect(publicFiles).not.toMatch(/(API_KEY|MAPBOX_TOKEN|GOOGLE_TAG)/);
});
