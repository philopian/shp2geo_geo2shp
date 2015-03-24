var fs      = require('fs');
var shell   = require('shelljs');
var glob    = require('glob');
var async   = require('async');


function builCmd_reprojectShp(IN_FILE,OUT_FILE,epsg){  
  return "ogr2ogr -f 'ESRI Shapefile' -t_srs EPSG:"+epsg+" "+OUT_FILE+" "+IN_FILE;// EPSG:4326 web mercator
}
function buildCmd_geojson2shp(IN_FILE,OUT_FILE){
  return 'ogr2ogr -f "ESRI Shapefile" '+OUT_FILE+' '+IN_FILE;
}

