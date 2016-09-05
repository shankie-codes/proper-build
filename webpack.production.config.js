"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var config = require('/source/proper-config.json');
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');
var getTemplatePath = require('./js/GetTemplatePath.js');

var config = config.build; // Remap this to the bits that we actually need
var source = `/source/${config.source}`;


// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.css/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
});

// local scss modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.scss/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'sass')
});
// global css files
loaders.push({
	test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
	loader: ExtractTextPlugin.extract('style', 'css')
});

module.exports = {
	entry: [
		// `${source}/src/index.js`
		path.join(source, config.js.srcDir, config.js.entrypoint)
	],
	// context : "/source",
	// devtool : 'source-map',
	output: {
		path: path.join(source, config.js.destDir),
		filename: config.js.destName
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders
	},
	plugins: [
		// new WebpackCleanupPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpackUglifyJsPlugin({
		  cacheFolder: path.resolve(source, config.js.destDir, 'cached_uglify'),
		  debug: true,
		  minimize: true,
		  sourceMap: false,
		  output: {
		    comments: false
		  },
		  compressor: {
		    warnings: false
		  }
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('style.css', {
			// allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: getTemplatePath(),
			title: 'Webpack App'
		})
	]
};
