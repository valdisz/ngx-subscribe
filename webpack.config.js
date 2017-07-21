var path = require("path");
var webpack = require("webpack");

var PATHS = {
    entryPoint: path.resolve(__dirname, 'src/index.ts'),
    bundles: path.resolve(__dirname, '_bundles'),
}

var config = {
    entry: {
        'ngx-subscribe': [PATHS.entryPoint],
        'ngx-subscribe.min': [PATHS.entryPoint]
    },

    output: {
        path: PATHS.bundles,
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'ngx-subscribe',
        umdNamedDefine: true
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    devtool: 'source-map',

    externals: [
        'rxjs'
    ],

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            include: /\.min\.js$/,
        })
    ],

    module: {
        loaders: [{
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/,
            query: {
                // we don't want any declaration file in the bundles
                // folder since it wouldn't be of any use ans the source
                // map already include everything for debugging
                declaration: false,
            }
        }]
    }
}

module.exports = config;