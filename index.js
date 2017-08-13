var express = require('express');
var app = express();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise




var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//DATABASE CONNECTION
var ROOMS_COLLECTION = "rooms";

var db;

// mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database){
// 	if (err)
// 	{
// 		console.log(err);
// 		process.exit(1);
// 	}
// 	db = database;

// 	console.log('Database connection ready !');

// 	app.listen(port, function(){
// 		console.log('App is running on port: ' + port);
// 	});

// });

mongoose.connect(process.env.MONGODB_URI, function(err, database){
	if (err)
	{
		console.log(err);
		process.exit(1);
	}
	db = database;

	console.log('Database connection ready !');

	app.listen(port, function(){
		console.log('App is running on port: ' + port);
	});

});






// MODEL DEFINITION
var Schema = mongoose.Schema;

var roomSchema = new Schema
(
	{
		name: String,
		description: String,
		capacity: Number,
		equipements:
		[
			{
				name: String
			}
		],
		createdAt: {type: Date, default: Date.now},
		updatedAt: {type: Date, default: Date.now},
	},
	{versionKey: false}
);

// MODEL CREATION
var Room = mongoose.model('Room', roomSchema);

// MODEL CALLED
//var Room = require('./models/room');

var bigroom = new Room
(
	{
		name: 'Chez TATA',
		capacity: 1,
		equipements:
		[
			{
				name: 'Pomme'
			},
			{
				name: 'Pain'
			}
		]
	}
);

//SAVING IN DATABASE
bigroom.save(function(err){
	if (err)
	{
		throw (err);
		console.log('Not saved :(')
	}
	console.log('Saved !')
});


//DELETE COLLECTION
// Room.remove(function(err) {
//    	if (err)
//    		throw (err);
//    	console.log('Room successfully deleted!');
// });


/////////////////////////////////////



//NEW FUNTION getJSON
function getJSON(url){
	return new Promise(function(resolve, reject)
	{
		//DO THE USUAL XHR STUFF
		var req = new XMLHttpRequest();
		req.open('GET', url);
		req.onload = function()
		{
			//THIS IS CALLED EVEN ON 404
			//SO CHECK THE STATUS
			console.log('status :' + req.status)
			if(req.status == 200)
			{
				//RESOLVE THE PROMISE WITH THE RESPONSE TEXT
				resolve(JSON.parse(req.responseText));
			}
			else
			{
				//OTHERWISE REJECT WITH THE STATUS TEXT
				//WHICH WILL HOPEFULLY BE A MEANINGFUL ERROR
				reject(Error(req.statusText));
			}
		};

		//HANDLE NETWORKS ERRORS
		req.onerror = function()
		{
			reject(Error("Network Error"));
		};

		//MAKE THE REQUEST
		req.send();
	});
}

//GETTING INFO FROM STATIONF API
getJSON("http://online.stationf.co/tests/rooms.json").then(function(rooms)
{
	console.log(rooms);
}).catch(function(err)
{
	console.log(err);
});


//PUT ENTRIES INTO ROOMS_COLLECTION
//DISPLAY ROOMS IN INDEX.EJS




///////////////////////////////////////////////


app.get('/', function(req, res){
	Room.find(function(err, rooms){
		if (err)
			throw (err);

		res.send(rooms);
	});
	// res.render('index')
});





