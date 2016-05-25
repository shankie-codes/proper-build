var fs = require('fs');

//Read data
var config = require('/source/proper-config.json');
var template = require('/build/proper-config.json');

//Manipulate config
config.build = template.build;

//Output config
fs.writeFile('/source/proper-config.json', JSON.stringify(config, null, 2));