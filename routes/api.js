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

		} else if (data.action === "updateResearch") {
			var researchID = data.researchID;
			var contents = data.contents;
			var field = data.field;
			updateResearch(researchID, field, contents, function() {
				response.json({success: true});
			});
		} else if (data.action === "deleteResearch") {
			var topicID = data.topicID;
			var researchID = data.researchID;

			deleteResearch(topicID, researchID, function() {
				response.json({success: true});
			});
		} else {
			console.log("action: " + data.action);
			return response.json({success: false});
		}
	})

router.route("/research/:topicID")
	.get(function(request, response) {
		var topicID = request.params.topicID;

		getResearch(topicID, function(research) {
			response.send({research: research});
		});
	})

router.route("/notes")
	.post(function(request, response) {
		var data = request.body;

		if (data.action === "updateTopicNotes") {
			var topicID = data.topicID;
			var newText = data.newText;

			updateTopicNotes(topicID, newText, function() {
				response.json({success: true});
			});
		} else {
			console.log("action: " + data.action);
			return response.json({success: false});			
		}
	})

router.route("/recommendations")
	.get(function(request, response) {

		Research.findOne({}, function(err, data) {

			var recommendations = data.recommendations;

			response.json({recommendations: recommendations});

		});
	})

	.post(function(request, response) {

		var newContent = request.body.newContent;

		var newDoc = {recommendations: newContent};

		Research.findOneAndUpdate({}, newDoc, function(err, doc) {
			if (err) console.log(err);
		});

		response.json({success: true});

	})

module.exports = router;

function updateTopicNotes(topicID, newText, callback) {

	Research.findOne({}, function(err, data) {

		var topics = data.topics;

		for (var i = 0; i < topics.length; i++) {
			if (topics[i]._id == topicID) {

				topics[i].notes = newText;

				break;
			}
		}

		var newDoc = {topics: topics};

		Research.findOneAndUpdate({}, newDoc, function(err, doc) {
			if (err) console.log(err);

			callback();
		});

	});
}

function deleteResearch(topicID, researchID, callback) {

	Research.findOne({}, function(err, data) {

		var research = data.research;
		console.log(research);
		console.log(research.length);

		for (var i = 0; i < research.length; i++) {
			if (research[i]._id == researchID) {
				if (research[i].topicIDs.length > 1) {
					var index = research[i].topicIDs.indexOf(topicID);
					research[i].topicIDs.splice(index, 1);
				} else {
					research.splice(i, 1);
				}

				break;
			}
		}

		var newDoc = {research: research};

		Research.findOneAndUpdate({}, newDoc, function(err, doc) {
			if (err) console.log(err);

			callback();
		});

	});
}

function updateResearch(researchID, field, contents, callback) {

	Research.findOne({}, function(err, data) {

		var allResearch = data.research;

		for (var i = 0; i < allResearch.length; i++) {
			if (allResearch[i]._id == researchID) {

				if (field.indexOf("view-research-link") !== -1) {
					allResearch[i].link = contents;
				} else if (field.indexOf("view-research-title") !== -1) {
					allResearch[i].title = contents;
				} else if (field.indexOf("view-research-date") !== -1) {
					allResearch[i].date = contents;
				} else if (field.indexOf("view-research-source") !== -1) {
					allResearch[i].source = contents;
				} else if (field.indexOf("view-research-summary") !== -1) {
					allResearch[i].summary = contents;
				} else {
					console.log("error: invalid field name to modify in research: " + field);
				}

				break;																						
			}
		}

		var newDoc = {research: allResearch};

		Research.findOneAndUpdate({}, newDoc, function(err, doc) {
			if (err) console.log(err);
		});

	});


}

function getResearch(topicID, callback) {

	Research.findOne({}, function(err, data) {

		var allResearch = data.research;

		var research = [];
		for (var i = 0; i < allResearch.length; i++) {
			var topicIDs = allResearch[i].topicIDs;
			for (var j = 0; j < topicIDs.length; j++) {
				if (topicIDs[j] == topicID) {
					research.push(allResearch[i]);
				}
			}
		}

		callback(research);

	});
}

function insertNewResearch(document) {

	Research.findOne({}, function(err, data) {

		var research = data.research;

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
			height: newHeight,
			notes: ""			
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
			height: 1,
			notes: ""
		}

		topics.push(json);

		var newDoc = {topics: topics};

		Research.findOneAndUpdate({}, newDoc, {upsert: true}, function(err, doc) {
			if (err) console.log(err);
		});


	});

}