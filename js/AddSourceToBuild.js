var fs = require('fs');

//Read config
var config = require('/source/proper-config.json');

//Manipulate config
config.build.source = process.argv[2];

//Output config
fs.writeFile('/source/proper-config.json', JSON.stringify(config, null, 2))