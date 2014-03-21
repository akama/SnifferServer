var MongoClient = require('mongodb').MongoClient;

var mongo = require('mongodb');

var BSON = mongo.BSONPure;

var db;

MongoClient.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/packet-server-production", function(err, db_local) {
	if (err) { 
		console.log("Error" + err); 
	} else {
		console.log("Connected.");

		db = db_local;

		console.log("Connected to " + (process.env.MONGODB_DATABASE || "packet-server-production") + " database");
		db.collection('packets', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'packets' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});

exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving packet: ' + id);
	db.collection('packets', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function (err, item) {
			res.send(item);
		});
	});
};

exports.findAll = function(req, res) {
	db.collection('packets', function(err, collection) {
		collection.find().toArray( function(err, items) {
			console.log("Size of array: " + items.length);
			res.send(items);
		});
	});
};

exports.lastTime = function(req, res) {
	var unix = unixTimeSearchFrom(req.params.seconds);
	console.log("Unix time searching from: " + unix);
	db.collection('packets', function(err, collection) {
		collection.find({"time" : { $gt: unix }}).toArray(function (err, items) {
			console.log("Size of array: " + items.length);
			res.send(items);
		});
	});
};

exports.addPacket = function(req, res) {
	var packet = req.body;
	console.log('Adding packet: ' + JSON.stringify(packet) + ' and the type is ' + typeof(packet));
	packet.time = parseInt(packet.time);
	packet.signal = parseInt(packet.signal);
	db.collection('packets', function(err, collection) {
		collection.insert(packet, {safe:true}, function(err, result) {
			if (err) {
				console.log("An error has occurred.");
				res.send({'error':'An error has occurred'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
};

exports.updatePacket = function(req, res) {
	var id = req.params.id;
	var packet = req.body;
	console.log('Updating packet: ' + id);
	console.log(JSON.stringify(packet));
	db.collection('packets', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, packet, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error updating packet: ' + err);
				res.send({'error': 'An error has occured'});
			} else {
				console.log('' + result + ' document(s) updated');
				res.send(packet);
			}
		});
	});
};

exports.deletePacket = function(req, res) {
	var id = req.params.id;
	console.log('Deleting packet: ' + id);
	db.collection('packets', function(err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred - ' + err});
			} else {
				console.log('' + result + ' document(s) deleted');
				res.send(req.body);
			}
		});
	});
};

var unixTimeSearchFrom = function(seconds) {
	var unix = Math.round(+new Date()/1000);
	return unix - seconds;
};

var populateDB = function() {
 
    var packet = [
    {
       "location": "stv",
       "oui": "f8:f1:b6",
       "time": 1382447516.213061,
       "id": "644da078930adba18b6756aeba53237faee94917337833b54d487be91cbcc06ef03a91c310484d35feae81ee578eed687ea529f0c7f0e36f4e1fb6158deef6f5",
       "signal": -55
    },
    {
        "location": "stv", 
        "oui": "f8:f1:b6", 
        "time": 1382447605.672165, 
        "id": "644da078930adba18b6756aeba53237faee94917337833b54d487be91cbcc06ef03a91c310484d35feae81ee578eed687ea529f0c7f0e36f4e1fb6158deef6f5", 
        "signal": -58
    }];
 
    db.collection('packets', function(err, collection) {
        collection.insert(packet, {safe:true}, function(err, result) {});
    });
 
};
