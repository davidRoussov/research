app.controller("researchRecommendationsController", function($scope, $http, $rootScope) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/#!/recommendations']").parent().addClass("active"); // making recommendations menu button highlighted

	var userID = localStorage.getItem("userID");
	if (userID) {
		$http.post("/api/recommendations", {action: "getRecommendations", userID: userID}).then(function(response) {
			$scope.recommendations = response.data.recommendations;
		});		
	}

	$scope.updateRecommendations = function(event) {
		var textarea = $(event.target);
		var newContent = textarea.val();
		
		var userID = localStorage.getItem("userID");

		if (userID) {
			$http.post("/api/recommendations", {action: "updateRecommendations", userID: userID, newContent: newContent}).then(function(response) {
				console.log(response.data);
			});
		}

	}

});