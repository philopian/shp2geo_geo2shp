var fs      = require('fs');
var shell   = require('shelljs');
var glob    = require('glob');
var async   = require('async');


function builCmd_shp2wm(IN_FILE,OUT_FILE){  
  return "ogr2ogr -f 'ESRI Shapefile' -t_srs EPSG:4326 "+OUT_FILE+" "+IN_FILE;// EPSG:4326 web mercator
}
function buildCmd_shp2geojson(IN_FILE,OUT_FILE){
  return 'ogr2ogr -f "GeoJSON" '+OUT_FILE+' '+IN_FILE;
}
