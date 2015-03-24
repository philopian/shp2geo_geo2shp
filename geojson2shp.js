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


var workingDir = __dirname+"/data/out/*.geojson";
glob(workingDir, {}, function (er, files) {
  if (files.length > 0){
    for (var i in files){
      var geojson    = files[i];
      var shp    = files[i].slice(0, -8).concat(".shp");

      async.series([
          function(next){ 
            console.log(".....create shp");
            var cmd_geo2shp = buildCmd_geojson2shp(geojson,shp);
            shell.exec(cmd_geo2shp);
            next();
          },
          function(next){
            console.log("...completed: "+geojson) 
          }
      ]);
    }//for each .shp    
  }// if *.shp files found
});