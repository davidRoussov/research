var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Research = mongoose.model('Research');

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
			createTopLevelTopic();

			return response.json({success: true});
		}
		else {
			console.log("action: " + data.action);

			return response.json({success: false});
		}

	});

module.exports = router;

function createTopLevelTopic() {

	Research.findOne({}, function(err, data) {

		if (err) {
			console.log("hi");
			return;
		}
		
		// checking if user has any topics in db initially
		var topics;
		if (data) {
			topics = data.topics;

			// getting highest ranked top level topic
			var highestRank = -Infinity;
			for (var i = 0; i < topics.length; i++) {
				if (topics[i].parentID == null) {
					if (topics[i].rank > highestRank) {
						highestRank = topics[i].rank;
					}
				}
			}
		} else {
			topics = [];

			// no topics, no ranks, set initial rank arbitrarily to 0
			highestRank = 0;
		}	


		var json = {
			topicName: "[placeholder topic name]",
			parentID: null,
			rank: highestRank + 1,
			height: 1
		}

		topics.push(json);

		var newDoc = {topics: topics};

		Research.findOneAndUpdate({}, newDoc, {upsert: true}, function(err, doc) {
			if (err) console.log(err);
		});


	});

}