'use strict';

const path = require('path');
const webpack = require('webpack');


module.exports = {
    env : process.env.NODE_ENV,
    entry: {
        app: path.resolve(path.resolve(__dirname, 'example'), 'bootstrap.js'),
        vendor: ['react', 'redux', 'react-redux']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        publicPath: '/'
    },
    stats: {
        colors: true,
        reasons: true
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                exclude: /(node_modules|bower_components)/,
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel?presets[]=stage-0&presets[]=react&presets[]=es2015&plugins[]=transform-class-properties']
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'example'),
        port: 3000
    },
    devtool: 'eval'
};