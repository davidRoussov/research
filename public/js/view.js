app.controller("viewResearchController", function($scope, $rootScope, $http) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/#!/view']").parent().addClass("active"); // making view menu button highlighted
	



	var temptopics;




	$scope.editTopicTitle = function(event) {
		var input = $(event.target);
		var newTitle = input.val();
		var topicID = input.parent().attr("id");

		var userID = localStorage.getItem("userID");

		$http.post("/api/topics/" + topicID, {action: "updateTopicTitle", userID: userID, newTitle: newTitle});
	};


	$scope.createNewSubtopic = function(topic, newTopic) {
		
		var parentID = topic._id;

		var userID = localStorage.getItem("userID");

		$http.post('/api/topics', {action: "createNewSubtopic", userID: userID, parentID: parentID, topicName: newTopic}).then(function(response) {
			hideModal();


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

	$scope.editResearch = function(event) {
		var td = $(event.target);
		var contents = td.html();
		var researchID = td.parent().attr("id");
		var field = td.attr("class");

		var userID = localStorage.getItem("userID");

		$http.post("/api/research", {action: "updateResearch", userID: userID, field: field, researchID: researchID, contents: contents});
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

		var userID = localStorage.getItem("userID");

		$http.post("/api/research", {action: "deleteResearch", userID: userID, researchID: researchID, topicID: topicID}).then(function(response) {
			console.log(response.data);
		});
	}

	$scope.deleteTopic = function(topic) {

		hideModal();

		var topicID = topic._id;
		temptopics = $rootScope.topics.slice();
		recurseDeleteTopic(temptopics, topicID);

		$rootScope.topics = [];
		for (var i = 0; i < temptopics.length; i++) {
			if (temptopics[i])
				$rootScope.topics.push(temptopics[i]);
		}


		var userID = localStorage.getItem("userID");

		$http.post("/api/topics", {action: "updateTopics", userID: userID, topics: $rootScope.topics});
	}

	function recurseDeleteTopic(temptopics, topicID) {

		for (var i = 0; i < $rootScope.topics.length; i++) {
			if ($rootScope.topics[i]._id == topicID) {
				temptopics[i] = null;
			}
			else if ($rootScope.topics[i].parentID == topicID) {
				recurseDeleteTopic(temptopics, $rootScope.topics[i]._id);
			}
		}

	}

});

