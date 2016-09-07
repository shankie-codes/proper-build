/* Get things that certain NPM scripts need and set them to environment variables */
var path = require('path');
var child_process = require('child_process');

var config = require('/source/proper-config.json');
var config = config.build; // Remap this to the bits that we actually need

var sourceDir = path.join('/source/', config.source);

process.env['npm_config_jssrcdir'] = path.join(sourceDir, config.js.srcDir);
process.env['npm_config_jsentrypoint'] = path.join(sourceDir, config.js.entrypoint);
process.env['npm_config_jsdestname'] = path.join(sourceDir, config.js.destName);
process.env['npm_config_jsdestdir'] = path.join(sourceDir, config.js.destDir);

process.env['npm_config_sassdestdir'] = path.join(sourceDir, config.sass.destDir);
process.env['npm_config_sasssrcdir'] = path.join(sourceDir, config.sass.srcDir);

process.env['npm_config_svgsrcdir'] = path.join(sourceDir, config.svg.srcDir);
process.env['npm_config_svgdestname'] = path.join(sourceDir, config.svg.destName);
process.env['npm_config_svgdestdir'] = path.join(sourceDir, config.svg.destDir);