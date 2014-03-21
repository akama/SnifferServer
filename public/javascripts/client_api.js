//
function limitPackets(hardLimit) {
	var packets = $(".hashbar");
	var times = packets.size() - hardLimit;
	for (var i = 1; i < times; i++) {
		packets[packets.size() - i].remove();
	}
}

function bulkUpdate(collection) {
	$( ".hashbar" ).animate({
		top: "+=" + (window.UNIT_HEIGHT * collection.length),
	}, window.ANIMATION_TIME);

	setTimeout( function () {bulkAdd(collection);}, window.ANIMATION_TIME);
}

function bulkAdd(collection) {
	for (var i = 0; i < collection.length; i++) {
		//console.log(collection[i]);
		var newPacket = idElement(collection[i].id, collection[i].time, collection[i].location, collection[i].signal);
		newPacket.css("top", i * window.UNIT_HEIGHT);
		$('#listPackets').append(newPacket);
	}
}

function addElement(hash, time, location, signal) {
	$( ".hashbar" ).animate({
		top: "+=" + (window.UNIT_HEIGHT),
	}, window.ANIMATION_TIME);

	setTimeout(function() {
		var newPacket = idElement(hash, time, location, signal);
		$("#listPackets").append(newPacket);}, window.ANIMATION_TIME);
}

function idElement( hash, time, location, signal) {
	var overall = $('<div>', {class : "hashbar"});
	overall.append($('<p>', {text : hash.substring(1,30), class : "hash"}));
	overall.append($('<p>', {text : time, class : "time"}));
	overall.append($('<p>', {text : location, class : "location"}));
	overall.append($('<p>', {text : signal, class : "signal"}));
	//overall.append($('<hr>', {class : "bar"}));
	
	//console.log(overall);
	return $('<div>', { class : "wrapper"}).append(overall); //overall;//$('<p>', {id : idNum, class : "textElement", text : message});
}
