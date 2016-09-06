"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var config = require('/source/proper-config.json');
var getTemplatePath = require('./js/GetTemplatePath.js');
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8888";

var config = config.build; // Remap this to the bits that we actually need
var source = `/source/${config.source}/`;

// global css
loaders.push({
	test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
	loaders: [
		'style?sourceMap',
		'css'
	]
});
// local scss modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.scss/,
	loaders: [
		'style?sourceMap',
		'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
		'sass'
	]
});

// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.css/,
	loaders: [
		'style?sourceMap',
		'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
	]
});

module.exports = {
	entry: [
		`webpack-dev-server/client?http://${HOST}:${PORT}`,
		`webpack/hot/only-dev-server`,
		path.join(source, config.js.srcDir, config.js.entrypoint) // Your appʼs entry point
	],
	// Not sure why this isn't working, causing error: Module build failed: Error: "/source/src/index.jsx" is not in the SourceMap.
	devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map', 
	output: {
		path: path.join(source, config.js.destDir),
		filename: 'bundle.js',
		hotUpdateChunkFilename : 'hotupdate.js',
		hotUpdateMainFilename : 'hotupdate.json'
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias: {
        'jquery': require.resolve('jquery'),
        '$': require.resolve('jquery'),
    }
	},
	module: {
		loaders
	},
	devServer: {
		contentBase: path.join(source, config.js.destDir),
		outputPath: path.join(source, config.js.destDir), // For WriteFilePlugin
		filename: 'bundle.js',
		// do not print bundle build stats
		noInfo: true,
		// enable HMR
		hot: true,
		// embed the webpack-dev-server runtime into the bundle
		inline: true,
		// serve index.html in place of 404 responses to allow HTML5 history
		historyApiFallback: true,
		port: PORT,
		host: HOST
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new WriteFilePlugin({
			log : false,
			useHashIndex: true
		}),
		new HtmlWebpackPlugin({
			template: getTemplatePath()
		}),
		// new webpackUglifyJsPlugin({
		//   cacheFolder: path.resolve(source, config.js.destDir, 'cached_uglify'),
		//   debug: true,
		//   minimize: false,
		//   sourceMap: true,
		//   output: {
		//     comments: true
		//   },
		//   compressor: {
		//     warnings: false
		//   }
		// }),
		// new BrowserSyncPlugin(
  //     // BrowserSync options 
  //     {
  //       // browse to http://localhost:3000/ during development 
  //       host: 'localhost',
  //       port: 3000,
  //       // proxy the Webpack Dev Server endpoint 
  //       // (which should be serving on http://localhost:3100/) 
  //       // through BrowserSync 
  //       proxy: `http://${HOST}:${PORT}/`
  //     },
  //     // plugin options 
  //     {
  //       // prevent BrowserSync from reloading the page 
  //       // and let Webpack Dev Server take care of this 
  //       reload: false
  //     }
  //   )
	]
};
