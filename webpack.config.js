var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var TransferWebpackPlugin = require('transfer-webpack-plugin')
var fs = require('fs')

var nodeModules = {}

fs.readdirSync('node_modules').filter(function(x) {
    return ['.bin'].indexOf(x) === -1
}).forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
})
var serverConfig = {
    entry: { index: "./server/server.ts" },
    output: {
        path: __dirname,
        filename: "dist/[name].js"
    },
    target: 'node',
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    resolve: {
        extensions: ['', '.ts', 'js']
    },
    node: {
        __dirname: false
    },
    externals: nodeModules
}


var webpackConfig = {
    entry: {
        'library': './client/library.ts',
        'polyfills': './client/polyfills.ts',
        'vendor': './client/vendor.ts',
        'main': './client/main.browser.ts'
    },
    
    output: {
        path: './public'
    },
    
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: ['main', 'vendor', 'polyfills'], minChunks: Infinity }),
        new HtmlWebpackPlugin({ 
            template: path.join(__dirname, 'client/index.html'),
            filename: path.join(__dirname, 'public/index.html')
        }),
        new CopyWebpackPlugin([
            // { from: 'components/**/*.html', to: path.join(__dirname, 'public'), context: path.join(__dirname, 'client/') },
            { from: 'components/**/*.css', to: path.join(__dirname, 'public'), context: path.join(__dirname, 'client/') },
            { from: 'images/**/*', to: path.join(__dirname, 'public'), context: path.join(__dirname, 'resource/') },
            { from: 'css/*', to: path.join(__dirname, 'public'), context: path.join(__dirname, 'resource/') },
//             { from: 'css/*', to: path.join(__dirname, 'public'), context: path.join(__dirname, 'node_modules/') },
            { from: `js/*`, to: path.join(__dirname, 'public/'), context: path.join(__dirname, 'resource/') },
            { from: `socket.io.js`, to: path.join(__dirname, 'public/js'), context: path.join(__dirname, 'node_modules/socket.io-client/') },
            { from: `ace.js`, to: path.join(__dirname, 'public/js'), context: path.join(__dirname, 'node_modules/ace-builds/src/') },
        ])
    ],

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            { test: /\.html$/, loader: 'html-loader' },
            { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9|=|.]+)?$/, loader: 'file-loader' },
        ]
    }
}

var defaultConfig = {
    devtool: 'cheap-module-source-map',
    cache: true,
    debug: true,
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },

    module: {
        preLoaders: [
        {
            test: /\.js$/,
            loader: 'source-map-loader',
            exclude: [
                path.join(__dirname, 'node_modules', 'rxjs'),
                path.join(__dirname, 'node_modules', '@angular2-material'),
                path.join(__dirname, 'node_modules', '@angular'),
            ]
        }],
        noParse: [
            path.join(__dirname, 'node_modules', 'zone.js', 'dist'),
            path.join(__dirname, 'node_modules', 'angular2', 'bundles')
        ]
    },
    
    resolve: {
        root: [ path.join(__dirname, 'client') ],
        extensions: ['', '.ts', '.js'],
        alias: {
            'jquery': path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js'),
            'es6-promise': path.join(__dirname, 'node_modules', 'es6-promise', 'dist', 'es6-promise.js'),
            'underscore': path.join(__dirname, 'node_modules', 'underscore', 'underscore-min.js'),
            'angular2/testing': path.join(__dirname, 'node_modules', '@angular', 'core', 'testing.js'),
            '@angular/testing': path.join(__dirname, 'node_modules', '@angular', 'core', 'testing.js'),
            'angular2/core': path.join(__dirname, 'node_modules', '@angular', 'core', 'index.js'),
            'angular2/platform/browser': path.join(__dirname, 'node_modules', '@angular', 'platform-browser', 'index.js'),
            'angular2/router': path.join(__dirname, 'node_modules', '@angular', 'router-deprecated', 'index.js'),
            'angular2/http': path.join(__dirname, 'node_modules', '@angular', 'http', 'index.js'),
            'angular2/http/testing': path.join(__dirname, 'node_modules', '@angular', 'http', 'testing.js')
        }
    },
    
    devServer: {
        historyApiFallback: true,
        watchOptions: { aggregateTimeout: 300, poll: 1000 }
    },

    node: {
        global: 1,
        crypto: 'empty',
        module: 0,
        Buffer: 0,
        clearImmediate: 0,
        setImmediate: 0
    }
}

var webpackMerge = require('webpack-merge');
module.exports = [webpackMerge(defaultConfig, webpackConfig), serverConfig]
