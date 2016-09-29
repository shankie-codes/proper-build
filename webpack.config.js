"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
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

module.exports = {
	entry: [
		`webpack-dev-server/client?http://${HOST}:${PORT}`,
		`webpack/hot/only-dev-server`,
		path.join(source, config.js.srcDir, config.js.entrypoint) // Your appʼs entry point
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'source-map', 
	output: {
		path: path.join(source, config.js.destDir),
		filename: config.js.destName || 'bundle.js',
		hotUpdateChunkFilename : 'hotupdate.js',
		hotUpdateMainFilename : 'hotupdate.json'
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias : {
      // 'jquery': '/build/node_modules/jquery/dist/jquery.min.js',
      // '$': '/build/node_modules/jquery/dist/jquery.min.js',
      modernizr$: path.resolve(__dirname, ".modernizrrc")
  	},
    root : ['/build', '/source/'],
	},
	resolveLoader : {
		modulesDirectories : ['/build'],
	},
	module: {
		loaders, noParse: /dist\/ol.js/
	},
	devServer: {
		contentBase: path.join(source, config.js.destDir),
		proxy: {
		  '/sync**': {
		          target: `https://${process.env.APP_HOST_PATH}`,
		          secure: false,
		          rewrite: function(req) {
		            req.url = req.url.replace(/^\/sync/, '');
		          },
		          changeOrigin: true,
		       }
		},
		outputPath: path.join(source, config.js.destDir), // For WriteFilePlugin
		filename: 'bundle.js',
		// do not print bundle build stats
		noInfo: true,
		// enable HMR
		hot: true,
		https: true,
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
		new webpack.ProvidePlugin({
		    $: "jquery",
		    jQuery: "jquery",
		    "window.jQuery": "jquery"
		})
	]
};
