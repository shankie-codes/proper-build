/**
 * Require Browsersync along with webpack and middleware for it
 */
var browserSync = require('browser-sync');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

/**
 * Require ./webpack.config.js and make a bundler from it
 */
var webpackConfig = require('./webpack.config');
var bundler = webpack(webpackConfig);

/**
 * Run Browsersync and use middleware for Hot Module Replacement
 */
browserSync({
    // server: {
    //   baseDir: 'app',

    //   middleware: [
    //     webpackDevMiddleware(bundler, {
    //       // IMPORTANT: dev middleware can't access config, so we should
    //       // provide publicPath by ourselves
    //       publicPath: webpackConfig.output.path,

    //       // pretty colored output
    //       stats: { colors: true }

    //       // for other settings see
    //       // http://webpack.github.io/docs/webpack-dev-middleware.html
    //     }),

    //     // bundler should be the same as above
    //     webpackHotMiddleware(bundler)
    //   ]
    // },

    proxy: {
        target: `https://${process.env.APP_HOST_PATH}`,
        // target: `http://gbhearts`,
        middleware: [
            require('webpack-dev-middleware')(bundler, {
                noInfo: true,
                publicPath: webpackConfig.output.path
            }),
            require("webpack-hot-middleware")(bundler)
        ]
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      'app/css/*.css',
      'app/*.html'
    ]
});