/* Get things that certain NPM scripts need and set them to environment variables */
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');

var config = require('/source/proper-config.json');

var output = '';
if(config.build){ // proper-build has already been initialised
	var config = config.build; // Remap this to the bits that we actually need
	var sourceDir = path.join('/source/', config.source);

	// Build up a string to write to a file
	var output = `
		export npm_config_jssrcdir=${path.join(sourceDir, config.js.srcDir)}
		export npm_config_jsentrypoint=${path.join(sourceDir, config.js.entrypoint)}
		export npm_config_jsdestname=${config.js.destName}
		export npm_config_jsdestdir=${path.join(sourceDir, config.js.destDir)}
		export npm_config_jsdestpath=${path.join(sourceDir, config.js.destDir, config.js.destName)}

		export npm_config_sassdestdir=${path.join(sourceDir, config.sass.destDir)}
		export npm_config_sasssrcdir=${path.join(sourceDir, config.sass.srcDir)}

		export npm_config_svgsrcdir=${path.join(sourceDir, config.svg.srcDir)}
		export npm_config_svgdestname=${path.join(sourceDir, config.svg.destName)}
		export npm_config_svgdestpath=${path.join(sourceDir, config.svg.destDir, config.svg.destName)}
		export npm_config_svgdestdir=${path.join(sourceDir, config.svg.destDir)}
	`
}

fs.writeFileSync('/build/envvars.sh', output);