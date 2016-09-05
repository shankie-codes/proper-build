var path = require('path');
var config = require('/source/proper-config.json');
var fileExists = require('file-exists');
var config = config.build; // Remap this to the bits that we actually need
var source = `/source/${config.source}`;

module.exports = function getTemplatePath(){
	var templatePath = path.join(source, config.js.srcDir, 'template.html');
	if(fileExists(templatePath)){
		return templatePath;
	}
	else{
		return '/build/src/template.html'
	}
}