var fs      = require('fs');
var shell   = require('shelljs');
var glob    = require('glob');
var async   = require('async');
var path    = require('path');

function builCmd_reprojectShp(IN_FILE,OUT_FILE,epsg){  
  return "ogr2ogr -f 'ESRI Shapefile' -t_srs EPSG:"+epsg+" "+OUT_FILE+" "+IN_FILE;// EPSG:4326 web mercator
}
function buildCmd_geojson2shp(IN_FILE,OUT_FILE){
  return 'ogr2ogr -f "ESRI Shapefile" '+OUT_FILE+' '+IN_FILE;
}


var workingDir = __dirname+"/data/*.geojson";
glob(workingDir, {}, function (er, files) {
  if (files.length > 0){
    for (var i in files){
      var geojson_in  = files[i];
      var fileName    = path.basename(geojson_in).slice(0,-8);
      var workingDir  = path.dirname(geojson_in);

      var shp_temp_shp   = path.join(workingDir,"."+fileName).concat(".shp");
      var shp_temp_files = path.join(workingDir,"."+fileName).concat(".*");
      var shp_rp_out     = path.join(workingDir,fileName).concat(".shp");
      async.series([
          function(next){ 
            console.log(".....create shp");
            var cmd_geo2shp = buildCmd_geojson2shp(geojson_in,shp_temp_shp);
            shell.exec(cmd_geo2shp);
            next();
          },
          function(next){
            console.log(".....reproject temp-shp to NAD83 / Oregon Lambert SRID:2991");
            var cmd_shp_reproject = builCmd_reprojectShp(shp_temp_shp,shp_rp_out,2991);
            shell.exec(cmd_shp_reproject);    
            next();
          },
          function(next){
            console.log(".....delete temp files");
            var cmd_removeTempFiles = "rm "+shp_temp_files
            shell.exec(cmd_removeTempFiles);    
            next();
          },
          function(next){
            console.log("...completed: "+fileName+".geojson") 
          }
      ]);
    }//loop-each-shp-file  
  }// if *.shp files found
});