app.controller("researchRecommendationsController", function($scope, $http) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/#!/recommendations']").parent().addClass("active"); // making recommendations menu button highlighted

	$http.get("/api/recommendations").then(function(response) {
		$scope.recommendations = response.data.recommendations;
	});

	$scope.updateRecommendations = function(event) {
		var textarea = $(event.target);
		var newContent = textarea.val();

		$http.post("/api/recommendations", {newContent: newContent}).then(function(response) {
			console.log(response.data);
		});
	}

});