
app.controller('topicsController', function($scope, $http, $rootScope) {
	var self = this;

	var sortedTopics; // consider figuring out how to get rid of this global variable

	$rootScope.$on("showTopicsAfterNewSubtopic", function(event, data) {

		var topics = $rootScope.topics;
		var newtopic = data.newtopic;
		topics.push(newtopic);
		generateTopics(topics);

	});

	$rootScope.$on("showTopicsAfterLogin", function(event, data) {
		self.showTopics();
	});


	self.showTopics = function() {

		var username = $rootScope.current_user;

		$http.post("/api/topics", {action: "getTopics", username: username}).then(function(response) {

			if (response.notopics) return;

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




	////////////////////////////////////////////////




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


	$scope.addTopLevelResearch = function(event) {

		var button = $(event.target);
		var topicName = button.parent().prev().children().first().val();
		var username = $rootScope.current_user;

	    $http.post('/api/topics', {action: "createTopLevelTopic", topicName: topicName, username: username}).then(function(response) {
	    	self.showTopics();
	    	$('.modal').modal('hide');
	    });
	    
	}

	$scope.topicChecked = function(event) {

		// FOR VIEW MODE, IF TOPIC IS CHECKED, ROOTSCOPE PROPERTY IS CHANGED TO VISIBLE/NOT VISIBLE
		var checkbox = $(event.target);
		var topicID = checkbox.parent().parent().attr("id");
		var checked = checkbox.is(":checked");

		for (var i = 0; i < $rootScope.topics.length; i++) {
			if ($rootScope.topics[i]._id == topicID) {
				if ($rootScope.topics[i].viewModeVisible) {
					$rootScope.topics[i].viewModeVisible = false;
				} else {




					updateViewModeOrder(i);




					$rootScope.topics[i].viewModeVisible = true;



					



					var topicID = $rootScope.topics[i]._id;

					var username = $rootScope.current_user;



				    // $http.get('/api/research/' + topicID).then(function(response) {


				    // 	$rootScope.topics[i].researches = response.data.research;

				    // });
				
						$http.post('/api/research', {action: "getResearch", topicID: topicID, username: username}).then(function(response) {
							$rootScope.topics[i].researches = response.data.research;
						});










				}
				break;
			}
		}

		

	}

	$scope.sortableOptions = {
		stop: function(e, ui) {
			
			var element = ui.item.get(0);
			var before = ui.item.prev().get(0);
			var after = ui.item.next().get(0);

			if (!before) {

			} else if (!after) {

			} else if (before && after) {

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
			if (sortedTopics[i].parentID === null || sortedTopics[i].visible) {
				sortedTopics[i].visible = true;
			} else {
				sortedTopics[i].visible = false;
			}
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


});















