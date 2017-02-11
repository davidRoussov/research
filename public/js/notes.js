app.controller("researchNotesController", function($scope, $http, $timeout, $rootScope, rsServices) {

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

	$scope.changingTextareaContent = function(event) {rsServices.changingTextareaContent(event)};


});