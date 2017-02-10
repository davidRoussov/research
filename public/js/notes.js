app.controller("researchNotesController", function($scope, $http, $timeout, $rootScope) {

	$("a[href='/#!/notes']").parent().addClass("active"); // making notes menu button highlighted



	$scope.updateTopicNotes = function(event, topic) {
		var textarea = $(event.target);
		var newText = textarea.val();
		var topicID = topic._id;

		var userID = localStorage.getItem("userID");

		$http.post("/api/notes", {action: "updateTopicNotes", userID: userID, topicID: topicID, newText: newText}).then(function(response) {
			$(".view-notes-textarea").css("color", "black");
		});
	}

	$scope.keypress = function(event) {

		var textarea = event.target;
		textarea.style.height = "1px";
		textarea.style.height = (25 + textarea.scrollHeight) + "px";

		$(event.target).css("color", "red");
	}


});