// Used to merge package.json with packageAdditions.json so that the Docker build can cash the results of `npm install`
var packageJSON = require('../packageDependencies.json');
var packageAdditions = require('../packageAdditions.json');
var fs = require('fs');

fs.writeFile("package.json", JSON.stringify(Object.assign(packageJSON, packageAdditions), null, '\t'), function(err) {
    if(err) {
        return console.log(err);
    }
    // The file was saved
}); 