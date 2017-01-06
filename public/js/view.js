app.controller("viewResearchController", function($scope, $rootScope, $http) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/#!/view']").parent().addClass("active"); // making view menu button highlighted

	// user clicks topic checkbox, topics.js goes to here, to get the topic and show it on screen
	$rootScope.$on("viewTopic", function(event, topicID, checked) {

		for (var i = 0; i < $rootScope.topics.length; i++) {
			if ($rootScope.topics[i]._id == topicID) {
				if ($rootScope.topics[i].viewModeVisible) {
					$rootScope.topics[i].viewModeVisible = false;
				} else {
					$rootScope.topics[i].viewModeVisible = true;
				}
				break;
			}
		}


	});



	$scope.editTopicTitle = function(event) {
		var input = $(event.target);
		var newTitle = input.val();
		var topicID = input.parent().attr("id");

		$http.post("/api/topics/" + topicID, {action: "updateTopicTitle", newTitle: newTitle});
	};


	$scope.createNewSubtopic = function(event) {

		var button = $(event.target);
		var newTopic = button.parent().prev().children().first().val();
		var parentID = button.parent().parent().parent().parent().parent().attr("id");

		$http.post('/api/topics', {action: "createNewSubtopic", parentID: parentID, topicName: newTopic}).then(function(response) {
	    	$('.modal').modal('hide');
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

		// while async server deletes, we delete it clientside, then call topics.js to refresh LHS
		var topicID = topic._id;
		for (var i = 0; i < $rootScope.topics.length; i++) {
			if ($rootScope.topics[i]._id == topicID) {
				$rootScope.topics.splice(i,1);
			}
		}

		$http.post("/api/topics", {action: "updateTopics", topics: $rootScope.topics});
	}

});

