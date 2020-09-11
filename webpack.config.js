/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './test/index.tsx',
    // entry: ['node_modules/requirejs/require.js', './src/index.tsx'],

    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'bundle.min.js'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'inline-source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    // devServer: {
    //     // host: '0.0.0.0',
    //     // headers: {
    //     //     'Access-Control-Allow-Origin': '*'
    //     // },
    //     publicPath: '/',
    //     contentBase: path.join(__dirname, 'ChargesSheet')
    // },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: 'ts-loader', options: { transpileOnly: true } },

            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]
    },

    node: {
        child_process: 'empty',
        worker_threads: 'empty',
        fs: 'empty'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './wwwroot/index.html'
        }),
        new webpack.IgnorePlugin(/worker_threads/)
    ]
};
