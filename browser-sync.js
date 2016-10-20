/**
 * Require Browsersync along with webpack and middleware for it
 */
var browserSync = require('browser-sync');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var proxy = require('http-proxy-middleware');
var path = require('path');

var config = require('/source/proper-config.json');
var config = config.build; // Remap this to the bits that we actually need
var source = `/source/${config.source}/`;

/**
 * Require ./webpack.config.js and make a bundler from it
 */
var webpackConfig = require('./webpack.config');
var bundler = webpack(webpackConfig);

// var dontProxyHotUpdate = proxy(['/thecragg/users/hotupdate.json'], {
var dontProxyHotUpdate = proxy(['**/hotupdate*'], {
    target: 'https://127.0.0.1:8888/',
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    // logLevel: 'info',
    logLevel: 'info',
    pathRewrite: function (path, req) {
    	// console.log(`Tried ${path}`)
    	// return '/';
    	// return path.replace('/thecragg/users', '/');
    	return path.replace(/^(.*)(hotupdate\..*)/g, '/$2');
    },
    // pathRewrite : {
    // 	'^/thecragg/users' : '/'
    // },
    // router : {
    // 	'localhost:3000/hotupdate.json' : 'https://127.0.0.1:8888/hotupdate.json',
    // 	'localhost:3000/thecragg/users/hotupdate.json' : 'https://127.0.0.1:8888'
    // },
    secure: false
});

/**
 * Run Browsersync and use middleware for Hot Module Replacement
 */
browserSync({

	proxy: {
		target: `https://${process.env.APP_HOST_PATH}`,
		middleware: [
			dontProxyHotUpdate,
			require('webpack-dev-middleware')(bundler, {
				noInfo: true,
				publicPath: webpackConfig.output.path
			}),
			// require("webpack-hot-middleware")(bundler) // I don't think that we want this here as it can be handled by the webpack dev server
		],
	},

	// no need to watch '*.js' here, webpack will take care of it for us,
	// including full page reloads if HMR won't work
	files: [
	  path.join(source, '**/*.php'),
	  path.join(source, 'style.css'),
	  path.join(source, config.svg.destDir, config.svg.destName),
	]
});
