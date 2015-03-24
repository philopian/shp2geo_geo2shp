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


var workingDir = __dirname+"/data/*.shp";
glob(workingDir, {}, function (er, files) {
  if (files.length > 0){
    for (var i in files){
      var shp_in    = files[i];
      var shpWebMer = files[i].slice(0, -4).concat("_rp.shp");
      var tempfiles = files[i].slice(0, -4).concat("_rp*");
      var geojson   = files[i].slice(0, -4).concat(".geojson");

      async.series([
          function(next){ 
            console.log(".....reproject shp");
            var cmd_reproject = builCmd_shp2wm(shp_in,shpWebMer);
            shell.exec(cmd_reproject);
            next();
          },
          function(next){
            console.log(".....shape to geo");
            var cmd_shp2geojson = buildCmd_shp2geojson(shpWebMer,geojson);
            shell.exec(cmd_shp2geojson);    
            next();
          },
          function(next){
            console.log(".....delete temp files");
            var cmd_removeTempFiles = "rm "+tempfiles
            shell.exec(cmd_removeTempFiles);    
            next();
          },
          function(next){
            console.log("...completed: "+geojson) 
          }
      ]);

    }//for each .shp    
  }// if *.shp files found
});
