var path = require("path");
var webpack = require("webpack");

var PATHS = {
    entryPoint: path.resolve(__dirname, 'index.ts'),
    bundles: path.resolve(__dirname, 'dist'),
}

var config = {
    entry: {
        'ngx-subscribe': [PATHS.entryPoint],
    },

    output: {
        path: PATHS.bundles,
        filename: '[name].umd.js',
        libraryTarget: 'umd',
        library: 'ngx-subscribe',
        umdNamedDefine: true
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    devtool: 'source-map',

    externals: {
        'rxjs/Observable': { root: 'Rx.Observable', commonjs: 'rxjs/Observable', commonjs2: 'rxjs/Observable', amd: 'rxjs/Observable' },
        'rxjs/Subscription': { root: 'Rx.Subscription', commonjs: 'rxjs/Subscription', commonjs2: 'rxjs/Subscription', amd: 'rxjs/Subscription' },
    },

    plugins: [
    ],

    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                compilerOptions: {
                    declaration: false
                }
            }
        }]
    }
}

module.exports = config;


        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            include: /\.min\.js$/,
        })