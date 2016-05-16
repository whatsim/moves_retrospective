var program = require('commander');

var targetFile
var startDate
var endDate
var targetActivity = "walking"

program
  .version('0.0.1')
  .arguments('<cmd> [file] [start] [end] [activity]')
  .action(function (file, start, end, activity) {
  	if(!file) throw(new Error("must specify a target geojson file"))
    else {
    	targetFile = file
    	startDate = start ? new Date(start).getTime()/1000 : null
    	endDate = end ? new Date(end).getTime()/1000 : null
    	targetActivity = activity ? activity : targetActivity
    }
  });

program.parse(process.argv);

var moment = require('moment')

var addElevation = require('geojson-elevation').addElevation,
    TileSet = require('node-hgt').TileSet;

var fs = require('fs')

var geoJson = JSON.parse(fs.readFileSync(__dirname + '/' + targetFile))

addElevation(geoJson, new TileSet('./data'), function(err) {
    if (!err) {
        findHeightDelta(geoJson)
    } else {
    	console.error(err)
        throw(err);
    }
});

function findHeightDelta(geo){
	var plus = 0
	var minus = 0
	var lastHeight
	var features = geo.features
	var duration = 0,
		distance = 0,
		steps = 0,
		calories = 0
	// "duration":596,"distance":800,"steps":1054,"calories":47

	for(var f in features){
		var feature = features[f]
		var s = new moment(feature.properties.startTime,'YYYYMMDDTHHmmSSZ').utc().unix()
		if(feature.type === "Feature" && feature.properties.activities[0].group === targetActivity && ((s > startDate || !startDate) && (s < endDate|| !endDate))){
			duration += feature.properties.activities[0].duration
			distance += feature.properties.activities[0].distance
			steps += feature.properties.activities[0].steps
			calories += feature.properties.activities[0].calories
			var coords = feature.geometry.coordinates
			if(lastHeight === undefined){
				lastHeight = coords[0][0][2]
			}
			for(var i = 0; i < coords.length; i ++){
				for(var ii = 0; ii < coords[i].length; ii ++){
					var dif = coords[i][ii][2]-lastHeight
					if(dif > 0) plus += dif
					else minus += dif
					lastHeight = coords[i][ii][2]
				}
			}
		} // else console.log('ignoring ' + feature.properties.activities[0].activity)
	}
	console.log(plus + ' m positive vertical',minus + ' m negative vertical')
	console.log(duration/60/60/24 + ' days',distance * 0.00062 + " miles",steps + " steps",calories + " calories")
}