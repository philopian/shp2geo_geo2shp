var fs      = require('fs');
var path    = require('path');
var glob    = require('glob');
var shell   = require('shelljs');
// var exec    = require('child_process').exec;


function createGeojsonFileName(inFileName){
  return inFileName.slice(0, -4)+'.geojson';
}
function cmdShp2Geojson(IN_FILE,OUT_FILE){
  return "ogr2ogr -f 'GeoJSON' -t_srs EPSG:4326 "+OUT_FILE+" "+IN_FILE;// EPSG:4326 web mercator
}


var workingDir = "./data/**/*.shp";
glob(workingDir, {}, function (err, files) {
  if (err) throw err;
  for (var i in files) {
    var inFile = files[i];
    var outFile = createGeojsonFileName(files[i]);
    var cmd = cmdShp2Geojson(inFile,outFile);
    console.log("....making..(%s)",outFile);
    shell.exec(cmd);
  }
});
