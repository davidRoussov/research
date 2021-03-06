

app.controller('topicsController', function($scope, $http, $rootScope) {
	var self = this;

	var sortedTopics;




	/////////////////////////////////////////////////////////////////////////


	$rootScope.$on("showTopicsAfterNewSubtopic", function(event, data) {

		var topics = $rootScope.topics;
		var newtopic = data.newtopic;
		topics.push(newtopic);
		generateTopics(topics);

	});

	$rootScope.$on("refreshTopics", function(event, data) {
		self.showTopics();
	});


	self.showTopics = function() {

		var userID = localStorage.getItem("userID");
		if (!userID) return;

		$http.post("/api/topics", {action: "getTopics", userID: userID}).then(function(response) {

			if (response.data.notopics)  {
				return;
			}

			else {
				generateTopics(response.data);
			}

		});

	}
	self.showTopics();

	function generateTopics(topics) {
		sortTopics(topics);

		initializeTopicVisibility();

		$rootScope.topics = sortedTopics;	
	}




	//////////////////////////////////////////////////////////////////////////










	$scope.expandOrCollapseTopic = function(event) {

		var button = $(event.target);
		var topicID = button.parent().parent().attr("id");

		for (var i = 0; i < sortedTopics.length; i++) {
			if (sortedTopics[i].parentID === topicID) {
				if (sortedTopics[i].visible != true) {
					sortedTopics[i].visible = true;
				} else {
					recurseHideShow(topicID);
					break;
				}
			}
		}

		$rootScope.topics = sortedTopics;
	}
	function recurseHideShow(topicID) {

		for (var i = 0; i < sortedTopics.length; i++) {
			if (sortedTopics[i].parentID === topicID) {
				sortedTopics[i].visible = false;
				sortedTopics[i].viewModeVisible = false;
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







	$scope.addTopLevelResearch = function(event, topicName) {

		// this is for detecting user pressing enter to submit
		if (event.type == "keypress") {
			var keyCode = event.keyCode;	
			if (keyCode != 13) {
				return;
			}
		}


		var userID = localStorage.getItem("userID");

	    $http.post('/api/topics', {action: "createTopLevelTopic", topicName: topicName, userID: userID}).then(function(response) {
	    	self.showTopics();
	    	hideModal();
	    	$scope.newTopicName = "";
	    });
	    
	}


	$scope.topicChecked = function(event) {

		// FOR VIEW MODE, IF TOPIC IS CHECKED, ROOTSCOPE PROPERTY IS CHANGED TO VISIBLE/NOT VISIBLE
		var checkbox = $(event.target);
		var topicID = checkbox.parent().parent().parent().attr("id");
		var checked = checkbox.is(":checked");


		for (var i = 0; i < $rootScope.topics.length; i++) {
			if ($rootScope.topics[i]._id == topicID) {
				if ($rootScope.topics[i].viewModeVisible) {
					$rootScope.topics[i].viewModeVisible = false;
				} else {




					updateViewModeOrder(i);




					$rootScope.topics[i].viewModeVisible = true;



					



					var topicID = $rootScope.topics[i]._id;


					var userID = localStorage.getItem("userID");

				
					$http.post('/api/research', {action: "getResearch", topicID: topicID, userID: userID}).then(function(response) {
						$rootScope.topics[i].researches = response.data.research;
					});










				}
				break;
			}
		}

		

	}


	// each topic has property viewModeOrderRank which determines the order topics appear
	// when in view mode; the max order rank is found and when checkbox is clicked, that topic's
	// viewModeOrderRank is that max order rank plus one
	function updateViewModeOrder(topicIndex) {

		var maxRank = -Infinity;
		for (var i = 0; i < $rootScope.topics.length; i++) {
			if ($rootScope.topics[i].viewModeOrderRank && $rootScope.topics[i].viewModeOrderRank > maxRank) {
				maxRank = $rootScope.topics[i].viewModeOrderRank;
			}
		}
		if (maxRank == -Infinity) maxRank = 0;

		$rootScope.topics[topicIndex].viewModeOrderRank = maxRank + 1;
	}



	function initializeTopicVisibility() {
		for (var i = 0; i < sortedTopics.length; i++) {
			if (sortedTopics[i].parentID === null || sortedTopics[i].visible) {
				sortedTopics[i].visible = true;
			} else {
				sortedTopics[i].visible = false;
			}
		}
	}










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
			topLevelTopics = topLevelTopics.sort(compare);

			// the top level topic of lowest rank
			var topLevelTopic = topLevelTopics[0];

			recurseExtractChildren(topics, topLevelTopic, sortedTopics);
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











	// for sorting topics alphabetically
	function compare(a, b) {
		if (a.topicName.toUpperCase() < b.topicName.toUpperCase())
			return -1;
		if (a.topicName.toUpperCase() > b.topicName.toUpperCase())
			return 1;
		return 0;
	}




	// // for sorting topics by their rank
	// function compare(a, b) {
	// 	if (a.rank < b.rank)
	// 		return -1;
	// 	if (a.rank > b.rank)
	// 		return 1;
	// 	return 0;
	// }




});















