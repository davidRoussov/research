var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Research = mongoose.model('Research');
var ObjectID = require('mongodb').ObjectID;

router.route("/topics")
	.get(function(request, response) {
		
		var topics;
		Research.findOne({}, function(err,obj) { 

			if (obj) {
				var topics = obj.topics;
				response.send(topics); 
			} else {
				response.send({notopics: true});
			}


		});

	})

	.post(function(request, response) {
		var data = request.body;

		if (data.action === "createTopLevelTopic") {
			var topicName = data.topicName;

			createTopLevelTopic(topicName);

			return response.json({success: true});
		}
		else if (data.action === "createNewSubtopic") {
			var parentID = request.body.parentID;
			var topicName = request.body.topicName;	

			createNewSubtopic(parentID, topicName, function(newtopic) {
				return response.json({newtopic: newtopic});
			});

			//return response.json({success: true});
		}
		else if (data.action === "updateTopics") {
			var newTopics = request.body.topics;

			updateTopics(newTopics);

			return response.json({success: true});
		}
		else {
			console.log("action: " + data.action);

			return response.json({success: false});
		}

	});

//getting a topic and all its data by its topicID
router.route("/topics/:id")

	.post(function(request, response) {
		var data = request.body;

		if (data.action === "updateTopicTitle") {
			var topicID = request.params.id;
			var newTitle = data.newTitle;

			updateTopicTitle(topicID, newTitle);

			return response.json({success: true});
		} else {
			console.log("action: " + data.action);
			return response.json({success: false});
		}

	})


router.route("/research")
	.post(function(request, response) {
		var data = request.body;

		if (data.action === "insertNewResearch") {
			insertNewResearch(data.document);

			return response.json({success: true});

		} else {
			console.log("action: " + data.action);
			return response.json({success: false});
		}
	})


module.exports = router;

function insertNewResearch(document) {

	Research.findOne({}, function(err, data) {

		var research = data.research;
		console.log(document.topicIDs);

		research.push(document);

		var newDoc = {research: research};

		Research.findOneAndUpdate({}, newDoc, function(err, doc) {
			if (err) console.log(err);
		});

	});

}

function updateTopics(topics) {
	var newDoc = {topics: topics};

	Research.findOneAndUpdate({}, newDoc, function(err, doc) {
		if (err) console.log(err);
	});
}

function createNewSubtopic(parentID, topicName, callback) {

	Research.findOne({}, function(err, data) {

		var topics = data.topics;

		var newHeight = getTopicHeight(topics, parentID) + 1;

		var newRank = getHighestRank(topics, parentID) + 1;

		var objectid = new ObjectID();

		var json = {
			_id: objectid,
			topicName: topicName,
			parentID: parentID,
			rank: newRank,
			height: newHeight
		}

		topics.push(json);

		callback(json);

		var newDoc = {topics: topics};

		Research.findOneAndUpdate({}, newDoc, {upsert: true}, function(err, doc) {
			if (err) console.log(err);
		});

	});
}

function getHighestRank(topics, parentID) {
	var highestRank = -Infinity;
	for (var i = 0; i < topics.length; i++) {
		if (topics[i].parentID == parentID) {
			if (topics[i].rank > highestRank) {
				highestRank = topics[i].rank;
			}
		}
	}

	if (highestRank == -Infinity) highestRank = 0;

	return highestRank;
}

function getTopicHeight(topics, id) {
	for (var i = 0; i < topics.length; i++) {
		if (topics[i]._id == id) {
			return topics[i].height;
		}
	}	
}

function updateTopicTitle(topicID, newTitle) {

	Research.findOne({}, function(err, data) {

		if (err) {
			console.log("error: could not update topic title");
			return;
		}

		var topics = data.topics;
		for (var i = 0; i < topics.length; i++) {
			if (topics[i]._id == topicID) {
				topics[i].topicName = newTitle;
			}
		}

		data.topics = topics;

		Research.findOneAndUpdate({}, data, function(err, doc) {
			if (err) console.log(err);
		});

	});
}

function createTopLevelTopic(topicName) {

	Research.findOne({}, function(err, data) {

		if (err) {
			console.log("error: could not create top level topic");
			return;
		}
		
		// checking if user has any topics in db initially
		var topics;
		if (data) {
			topics = data.topics;

		} else {
			topics = [];
		}	

		var newRank = getHighestRank(topics, null) + 1;


		var json = {
			topicName: topicName,
			parentID: null,
			rank: newRank,
			height: 1
		}

		topics.push(json);

		var newDoc = {topics: topics};

		Research.findOneAndUpdate({}, newDoc, {upsert: true}, function(err, doc) {
			if (err) console.log(err);
		});


	});

}