app.controller("researchRecommendationsController", function($scope, $http, $rootScope) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/#!/recommendations']").parent().addClass("active"); // making recommendations menu button highlighted


	var user = $rootScope.current_user;
	if (user) {
		$http.post("/api/recommendations", {action: "getRecommendations", username: user}).then(function(response) {
			$scope.recommendations = response.data.recommendations;
		});		
	}


	$scope.updateRecommendations = function(event) {
		var textarea = $(event.target);
		var newContent = textarea.val();
		var username = $rootScope.current_user;

		if (username) {
			$http.post("/api/recommendations", {action: "updateRecommendations", username: username, newContent: newContent}).then(function(response) {
				console.log(response.data);
			});
		}


	}

});