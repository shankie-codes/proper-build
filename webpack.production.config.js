"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var config = require('/source/proper-config.json');
// var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');
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
		path.join(source, config.js.srcDir, config.js.entrypoint)
	],
	output: {
		path: path.join(source, config.js.destDir),
		filename: config.js.destName || 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias: {
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
		loaders,
		noParse: /dist\/ol.js/
	},
	plugins: [
		// new WebpackCleanupPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: true,
				drop_debugger: true
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin(path.join('..', '..', config.sass.srcDir, "external", "_builtbywebpack.scss"), {
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: getTemplatePath(),
			title: 'Webpack App'
		}),
		new webpack.ProvidePlugin({
		    $: "jquery",
		    jQuery: "jquery",
		    "window.jQuery": "jquery"
		})
	]
};
