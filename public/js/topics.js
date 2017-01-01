var sortedTopics; // consider figuring out how to get rid of this global variable

var topicColorSequence = ["#FF9999", "#8C8CFF", "#73C78F", "#A366A3", "#855C33"];
var topicGradientSequence = [["#DB4C4C", "#D42626"],["#2626A8", "#0D0D9E"],["#267D26","#0D6E0D"],["#7D267D", "#6E0D6E"],["#7D5226", "#6E3D0Ds"]];
var topicBorderColorSequence = ["#CC0000"];

app.controller('topicsController', function($scope, $http, $rootScope) {
	var self = this;

	self.showTopics = function() {

		$http.get("/api/topics").then(function(response) {

			if (response.notopics) return;

			sortTopics(response.data);

			addTopicStyle();

			initializeTopicVisibility();

			$scope.topics = sortedTopics;
		});

	}
	self.showTopics();

	$scope.expandOrCollapseTopic = function(event) {

		var button = $(event.target);
		var topicID = button.parent().parent().attr("id");

		for (var i = 0; i < sortedTopics.length; i++) {
			if (sortedTopics[i].parentID === topicID) {
				if (sortedTopics[i].visible != true) {
					sortedTopics[i].visible = true;

					// // looping through topics and finding the add new topic buttons
					// // and making them visible
					// for (var j = 0; j < sortedTopics.length; j++) {
					// 	if (sortedTopics[j].addButtonParentID === topicID) {
					// 		sortedTopics[j].visible = true;
					// 	}
					// }

				} else {
					recurseHideShow(topicID);
					break;
				}
			}
		}

		$scope.topics = sortedTopics;
	}


	$scope.addTopLevelResearch = function(event) {

	    $http.post('/api/topics', {action: "createTopLevelTopic"}).then(function(response) {
	    	self.showTopics();
	    });
	    
	}

	$scope.topicChecked = function(event) {
		var checkbox = $(event.target);
		var topicID = checkbox.parent().parent().attr("id");
		$rootScope.$emit('viewTopic', topicID);
	}

});


function sortTopics(topics) {
	sortedTopics = [];

	while (topics.length > 0) {


		// getting top level elements here
		var topLevelTopics = [];
		for (var i = 0; i < topics.length; i++) {
			if (topics[i].height == 1) {
				topLevelTopics.push(topics[i]);
			}
		}

		//sorting top level topics
		topLevelTopics = topLevelTopics.sort(function(a,b) {
			if (a.rank < b.rank)
				return -1;
			if (a.rank > b.rank)
				return 1;
			return 0;
		});

		// the top level topic of lowest rank
		var topLevelTopic = topLevelTopics[0];

		recurseExtractChildren(topics, topLevelTopic, sortedTopics);
	}
}

function recurseHideShow(topicID) {

	for (var i = 0; i < sortedTopics.length; i++) {
		if (sortedTopics[i].parentID === topicID) {
			sortedTopics[i].visible = false;


			// finding add new topic buttons and making them invisible if topic matches button id
			for (var j = 0; j < sortedTopics.length; j++) {
				if (sortedTopics[j].addButtonParentID === topicID) {
					sortedTopics[j].visible = false;
				}
			}


		}
	}

	var childrenIDs = [];
	for (var i = 0; i < sortedTopics.length; i++) {
		if (sortedTopics[i].parentID === topicID) {
			childrenIDs.push(sortedTopics[i]._id);
		}
	}

	if (childrenIDs.length == 0) {
		return;
	} else {
		for (var i = 0; i < childrenIDs.length; i++) {
			recurseHideShow(childrenIDs[i]);
		}
	}
}

function initializeTopicVisibility() {
	for (var i = 0; i < sortedTopics.length; i++) {
		if (sortedTopics[i].parentID === null) {
			sortedTopics[i].visible = true;

			for (var j = 0; j < sortedTopics.length; j++) {
				if (sortedTopics[j].addButtonParentID === sortedTopics[i]._id) {
					sortedTopics[j].visible = true;
				}
			}

		} else {
			sortedTopics[i].visible = false;
		}
	}
}

function addTopicStyle() {

	for (var i = 0; i < sortedTopics.length; i++) {
		
		

		if (sortedTopics[i].addButtonParentID) {
			var topicHeight = sortedTopics[i].height;
		} else {
			var topicHeight = sortedTopics[i].height - 1;
		}
		var colorIndex = topicHeight % topicColorSequence.length;

		sortedTopics[i].style = 
			"background-color: " + topicColorSequence[colorIndex];
			// "background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, " + topicGradientSequence[colorIndex][0] + "), color-stop(1, " + topicGradientSequence[colorIndex][1] + "));" +
			// "border: 1px solid " + topicBorderColorSequence[0] + ";";

	}

}

function recurseExtractChildren(topics, topLevelTopic, sortedTopics) {

	sortedTopics.push(topLevelTopic);

	// removing topppest level topic from available choices
	for (var i = 0; i < topics.length; i++) {
		if (topics[i]._id === topLevelTopic._id) {
			topics.splice(i, 1);
		}
	}


	var children = [];
	for (var i = 0; i < topics.length; i++) {
		if (topics[i].parentID === topLevelTopic._id) {
			children.push(topics[i]);
		}
	}


	if (children.length == 0) {
		return sortedTopics;
	} else {

		children = children.sort(compare);

		for (var i = 0; i < children.length; i++) {
			recurseExtractChildren(topics, children[i], sortedTopics);
		}

	}
}

// for sorting topics by their rank
function compare(a, b) {
	if (a.rank < b.rank)
		return -1;
	if (a.rank > b.rank)
		return 1;
	return 0;
}











