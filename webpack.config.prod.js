'use strict';

const path = require('path');
const webpack = require('webpack');
const ExternalsPlugin = require('webpack-externals-plugin');

const env = process.env.NODE_ENV;

const reduxExternal = {
    root: 'Redux',
    commonjs2: 'redux',
    commonjs: 'redux',
    amd: 'redux'
};

const reactExternal = {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
};

const reactDomExternal = {
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom'
};

const reactDomServerExternal = {
    root: 'ReactDOMServer',
    commonjs2: 'react-dom/server',
    commonjs: 'react-dom/server',
    amd: 'react-dom/server'
};

const reactReduxExternal = {
    root: 'ReactRedux',
    commonjs2: 'react-redux',
    commonjs: 'react-redux',
    amd: 'react-redux'
};

const reactEventEmitterExternal = {
    root: 'EventEmitter',
    commonjs2: 'eventemitter3',
    commonjs: 'eventemitter3',
    amd: 'eventemitter3'
};

const reactSeamlessImmutableExternal = {
    root: 'SeamlessImmutable',
    commonjs2: 'seamless-immutable',
    commonjs: 'seamless-immutable',
    amd: 'seamless-immutable'
};


let config = {
    entry: {
        app: path.resolve(path.resolve(__dirname + '/src'), 'index.js')
    },
    output: {
        library: 'ReactReduxOOP',
        libraryTarget: 'umd'
    },
    stats: {
        colors: true
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        noParse: /\.min\.js$/,
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']}
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        })
    ],
    externals: {
        'redux': reduxExternal,
        'react': reactExternal,
        'react-dom': reactDomExternal,
        'react-dom/server': reactDomServerExternal,
        'react-redux': reactReduxExternal,
        'eventemitter3': reactEventEmitterExternal,
        'seamless-immutable': reactSeamlessImmutableExternal,
    },
    devtool: 'source-map'
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                warnings: false
            }
        })
    )
}

module.exports = config;