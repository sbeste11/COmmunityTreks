const path = require('path');
const EsbuildPlugin = require('esbuild-loader').EsbuildPlugin;

module.exports = {
    entry: './src/js/map-setup.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'esbuild-loader',
                options: {
                    target: 'es2015', // Specify JavaScript target
                },
            },
        ],
    },
    optimization: {
        minimize: true, // Enable minification
        minimizer: [
            new EsbuildPlugin({
                target: 'es2015', // Minify for ES6
            }),
        ],
    },
};
