app.controller("viewResearchController", function($scope, $rootScope, $http) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/#!/view']").parent().addClass("active"); // making view menu button highlighted


	$scope.editTopicTitle = function(event) {
		var input = $(event.target);
		var newTitle = input.val();
		var topicID = input.parent().attr("id");

		$http.post("/api/topics/" + topicID, {action: "updateTopicTitle", newTitle: newTitle});
	};


	$scope.createNewSubtopic = function(topic, newTopic) {
		
		var parentID = topic._id;

		$http.post('/api/topics', {action: "createNewSubtopic", parentID: parentID, topicName: newTopic}).then(function(response) {
	    	$('.modal').modal('hide');
	    	$('.modal-backdrop').remove();


	    	// this code determines if the subtopics are already visible and if they are the new subtopic
	    	// will be set visible too before topics.js is called with the newtopic so that it updates the LHS
	 		var newtopic = response.data.newtopic;
	 		for (var i = 0; i < $rootScope.topics.length; i++) {
	 			if ($rootScope.topics[i].parentID == newtopic.parentID) {
	 				if ($rootScope.topics[i].visible) {
	 					newtopic.visible = true;
	 					break;
	 				}
	 			}
	 		}
	 		$rootScope.$emit("showTopicsAfterNewSubtopic", {newtopic: newtopic});

	    });

	};

	$scope.checkUserWriteTopicDelete = function(topic, userWriting) {
		var topicName = topic.topicName;

		if (userWriting === topicName) {
			$(".btn-danger").prop("disabled", false);
		} else {
			$(".btn-danger").prop("disabled", true);
		}

	}

	$scope.deleteTopic = function(topic) {

		$('.modal').modal('hide');
		$('.modal-backdrop').remove();

		var topicID = topic._id;
		var temptopics = $rootScope.topics.slice();
		deleteTopic(temptopics, topicID);

		$http.post("/api/topics", {action: "updateTopics", topics: $rootScope.topics});
	}

	$scope.editResearch = function(event) {
		var td = $(event.target);
		var contents = td.html();
		var researchID = td.parent().attr("id");
		var field = td.attr("class");

		$http.post("/api/research", {action: "updateResearch", field: field, researchID: researchID, contents: contents});
	}

	$scope.deleteResearchMode = function(event, topicID) {
		var button = $(event.target);

		for (var i = 0; i < $scope.topics.length; i++) {
			if ($scope.topics[i]._id == topicID) {
				if ($scope.topics[i].showDeleteButtons) {
					$scope.topics[i].showDeleteButtons = false;

					button.css("text-decoration", "none");
				} else {
					$scope.topics[i].showDeleteButtons = true;

					button.css("text-decoration", "underline");
				}
			}
		}


	}

	$scope.deleteResearch = function(event, research, topic) {
		var researchID = research._id;
		var topicID = topic._id;

		$http.post("/api/research", {action: "deleteResearch", researchID: researchID, topicID: topicID}).then(function(response) {
			console.log(response.data);
		});
	}


	function deleteTopic(temptopics, topicID) {

		for (var i = 0; i < $rootScope.topics.length; i++) {
			if ($rootScope.topics[i]._id == topicID) {
				temptopics[i] = null;
			}
			else if ($rootScope.topics[i].parentID == topicID) {
				deleteTopic(temptopics, $rootScope.topics[i]._id);
			}
		}
		
		$rootScope.topics = [];
		for (var i = 0; i < temptopics.length; i++) {
			if (temptopics[i])
				$rootScope.topics.push(temptopics[i]);
		}

	}


});

