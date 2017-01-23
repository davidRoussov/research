app.controller("researchNotesController", function($scope, $http, $timeout, $rootScope) {

	$("a[href='/#!/notes']").parent().addClass("active"); // making notes menu button highlighted

	$scope.updateTopicNotes = function(event, topic) {
		var textarea = $(event.target);
		var newText = textarea.val();
		var topicID = topic._id;

		var userID = localStorage.getItem("userID");

		$http.post("/api/notes", {action: "updateTopicNotes", userID: userID, topicID: topicID, newText: newText}).then(function(response) {
			console.log(response.data);
		});
	}

	$scope.autoExpand = function(event) {
		autoExpand();
	}

	function autoExpand() {
		$(".view-notes-textarea").height($(".view-notes-textarea")[0].scrollHeight - 10);
	}
});